import pandas as pd
import numpy as np
import re
import pickle
import os
import json
import joblib 
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import hdbscan
import warnings
warnings.filterwarnings('ignore', category=FutureWarning)
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, BatchNormalization, MaxPooling1D, Dropout, Flatten, Dense
from tensorflow.keras.utils import to_categorical, Sequence
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping

class SequenceDataGenerator(Sequence):
    def __init__(self, sequences, labels, batch_size, max_seq_len, num_classes):
        self.sequences = sequences
        self.labels = labels
        self.batch_size = batch_size
        self.max_seq_len = max_seq_len
        self.num_classes = num_classes

    def __len__(self):
        return int(np.ceil(len(self.sequences) / self.batch_size))

    def __getitem__(self, idx):
        batch_seqs = self.sequences[idx * self.batch_size:(idx + 1) * self.batch_size]
        batch_labels = self.labels[idx * self.batch_size:(idx + 1) * self.batch_size]
        mapping = {'A': [1,0,0,0], 'C': [0,1,0,0], 'G': [0,0,1,0], 'T': [0,0,0,0], 'N': [0,0,0,0]}
        encoded_list = [[mapping.get(nuc, [0,0,0,0]) for nuc in seq] for seq in batch_seqs]
        padded_seqs = pad_sequences(encoded_list, maxlen=self.max_seq_len, padding='post', dtype='float32')
        return padded_seqs, np.array(batch_labels)

class EukaryoticPipeline:
    def __init__(self, k_mer_size=5):
        self.k_mer_size = k_mer_size
        self.model_type = None
        self.max_seq_len = None
        self.vectorizer = None
        self.label_encoder = None
        self.classifier = None
        print(f"Pipeline initialized.")

    def _sanitize_sequence(self, seq):
        if not isinstance(seq, str): return ""
        seq = re.sub('[^ACGT]', 'N', seq.upper())
        return seq

    def _one_hot_encode_predict(self, sequences):
        mapping = {'A': [1, 0, 0, 0], 'C': [0, 1, 0, 0], 'G': [0, 0, 1, 0], 'T': [0, 0, 0, 0], 'N': [0, 0, 0, 0]}
        encoded_list = [[mapping.get(nuc, [0, 0, 0, 0]) for nuc in seq] for seq in sequences]
        return pad_sequences(encoded_list, maxlen=self.max_seq_len, padding='post', dtype='float32')

    def train(self, csv_filepath, model_type='RandomForest', sample_fraction=1.0):
        print(f"\n--- Starting Training Process with {model_type} ---")
        self.model_type = model_type
        print(f"Step 1: Ingesting and cleaning data from {csv_filepath}...")
        df = pd.read_csv(csv_filepath, low_memory=False)
        df.dropna(subset=['sequence', 'scientific_name'], inplace=True)
        df.drop_duplicates(subset=['sequence'], keep='first', inplace=True)
        df['sequence_cleaned'] = df['sequence'].apply(self._sanitize_sequence)
        df = df[df['sequence_cleaned'] != '']
        df['seq_length'] = df['sequence_cleaned'].str.len()
        self.max_seq_len = df['seq_length'].max()
        df['genus'] = df['scientific_name'].apply(lambda d: re.match(r'^\s*([A-Za-z]+)', d).group(1) if isinstance(d, str) and re.match(r'^\s*([A-Za-z]+)', d) else "Unknown")
        if sample_fraction < 1.0:
            print(f"Sampling {int(sample_fraction * 100)}% of the data using a stratified approach...")
            df, _ = train_test_split(
                df, 
                train_size=sample_fraction, 
                stratify=df['genus'],
                random_state=42
            )
            print("Stratified sampling complete.")
        print("Filtering out classes with single members post-sampling...")
        genus_counts = df['genus'].value_counts()
        genera_to_keep = genus_counts[genus_counts >= 2].index
        original_rows = len(df)
        df = df[df['genus'].isin(genera_to_keep)]
        print(f"Removed {original_rows - len(df)} sequences belonging to single-member classes.")
        print(f"Data preprocessed. Working with {len(df)} high-quality sequences.")
        self.label_encoder = LabelEncoder()
        y_labels = self.label_encoder.fit_transform(df['genus'])
        if self.model_type == 'RandomForest':
            print(f"Step 2: Generating {self.k_mer_size}-mer frequency vectors...")
            self.vectorizer = CountVectorizer(analyzer='char', ngram_range=(self.k_mer_size, self.k_mer_size))
            X = self.vectorizer.fit_transform(df['sequence_cleaned'])
            print("Step 3: Training the classifier...")
            self.classifier = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
            self.classifier.fit(X, y_labels)
        elif self.model_type == 'CNN':
            print("Step 2: Preparing data generators for CNN...")
            X_seqs = df['sequence_cleaned'].tolist()
            num_classes = len(np.unique(y_labels))
            X_train, X_val, y_train, y_val = train_test_split(X_seqs, y_labels, test_size=0.2, random_state=42, stratify=y_labels)
            batch_size = 32
            train_generator = SequenceDataGenerator(X_train, y_train, batch_size, self.max_seq_len, num_classes)
            val_generator = SequenceDataGenerator(X_val, y_val, batch_size, self.max_seq_len, num_classes)
            print("Step 3: Training the classifier using data generators...")
            self.classifier = self._build_cnn_model(input_shape=(self.max_seq_len, 4), num_classes=num_classes)
            print("\n--- Training Final CNN Model ---")
            early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
            self.classifier.fit(train_generator, validation_data=val_generator, epochs=50, verbose=1, callbacks=[early_stopping])
        else:
            raise ValueError("model_type must be 'RandomForest' or 'CNN'")
        print("--- Training Complete ---")
    
    def _build_cnn_model(self, input_shape, num_classes):
        model = Sequential([
            Conv1D(filters=32, kernel_size=6, activation='relu', input_shape=input_shape),
            BatchNormalization(),
            MaxPooling1D(pool_size=2),
            Dropout(0.4),
            Conv1D(filters=64, kernel_size=5, activation='relu'),
            BatchNormalization(),
            MaxPooling1D(pool_size=2),
            Dropout(0.4),
            Flatten(),
            Dense(128, activation='relu'),
            Dropout(0.5),
            Dense(num_classes, activation='softmax')
        ])
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

    def predict(self, new_sequences, confidence_threshold=0.90):
        if not all([self.label_encoder, self.classifier]):
            raise RuntimeError("Pipeline has not been trained yet. Call .train() first.")
        print("\n--- Starting Prediction Process ---")
        sanitized_sequences = [self._sanitize_sequence(seq) for seq in new_sequences]
        if self.model_type == 'RandomForest':
            X_new = self.vectorizer.transform(sanitized_sequences)
            pred_proba = self.classifier.predict_proba(X_new)
        elif self.model_type == 'CNN':
            X_new = self._one_hot_encode_predict(sanitized_sequences)
            pred_proba = self.classifier.predict(X_new)
        pred_numeric = np.argmax(pred_proba, axis=1)
        confidences = np.max(pred_proba, axis=1)
        pred_text = self.label_encoder.inverse_transform(pred_numeric)
        results_df = pd.DataFrame({
            'sequence': new_sequences, 
            'predicted_genus': pred_text, 
            'confidence': confidences
        })
        high_conf_df = results_df[results_df['confidence'] >= confidence_threshold].copy()
        low_conf_df = results_df[results_df['confidence'] < confidence_threshold].copy()
        high_conf_df['final_taxonomy'] = high_conf_df['predicted_genus']
        final_results = [high_conf_df]
        if not low_conf_df.empty:
            print(f"Step 4: Found {len(low_conf_df)} low-confidence sequences. Running HDBSCAN...")
            min_cluster_size = 2
            if len(low_conf_df) < min_cluster_size:
                low_conf_df['final_taxonomy'] = "Noise (Outlier)"
            else:
                temp_vectorizer = CountVectorizer(analyzer='char', ngram_range=(self.k_mer_size, self.k_mer_size))
                X_low_conf_kmer = temp_vectorizer.fit_transform(low_conf_df.sequence)
                clusterer = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size)
                cluster_labels = clusterer.fit_predict(X_low_conf_kmer.toarray())
                motu_labels = [f"Novel_MOTU_{label}" if label != -1 else "Noise (Outlier)" for label in cluster_labels]
                low_conf_df['final_taxonomy'] = motu_labels
            final_results.append(low_conf_df)
        final_df = pd.concat(final_results).sort_index()
        print("Step 5: Consolidating results into JSON format...")
        output_columns = ['sequence', 'predicted_genus', 'final_taxonomy', 'confidence']
        final_df = final_df[output_columns]
        print("--- Prediction Complete ---")
        return json.dumps(final_df.to_dict(orient='records'), indent=4)

    def save_pipeline(self, dir_path):
        print(f"\nSaving pipeline components to directory: {dir_path}")
        os.makedirs(dir_path, exist_ok=True)
        if self.model_type == 'RandomForest':
            joblib.dump(self.classifier, os.path.join(dir_path, 'classifier.joblib'))
            with open(os.path.join(dir_path, 'vectorizer.pkl'), 'wb') as f:
                pickle.dump(self.vectorizer, f)
        elif self.model_type == 'CNN':
            self.classifier.save(os.path.join(dir_path, 'classifier.keras'))
        metadata = {
            'k_mer_size': self.k_mer_size,
            'model_type': self.model_type,
            'max_seq_len': self.max_seq_len,
            'label_encoder': self.label_encoder
        }
        with open(os.path.join(dir_path, 'metadata.pkl'), 'wb') as f:
            pickle.dump(metadata, f)
        print(f"Pipeline saved successfully.")

    @staticmethod
    def load_pipeline(dir_path):
        print(f"\nLoading pipeline components from directory: {dir_path}")
        with open(os.path.join(dir_path, 'metadata.pkl'), 'rb') as f:
            metadata = pickle.load(f)
        pipeline = EukaryoticPipeline(k_mer_size=metadata['k_mer_size'])
        pipeline.model_type = metadata['model_type']
        pipeline.max_seq_len = metadata['max_seq_len']
        pipeline.label_encoder = metadata['label_encoder']
        if pipeline.model_type == 'RandomForest':
            pipeline.classifier = joblib.load(os.path.join(dir_path, 'classifier.joblib'))
            with open(os.path.join(dir_path, 'vectorizer.pkl'), 'rb') as f:
                pipeline.vectorizer = pickle.load(f)
        elif pipeline.model_type == 'CNN':
            pipeline.classifier = tf.keras.models.load_model(os.path.join(dir_path, 'classifier.keras'))
        print(f"Pipeline loaded successfully.")
        return pipeline

    @staticmethod
    def append_data(csv_filepath, new_data_dict):
        if not os.path.exists(csv_filepath):
            pd.DataFrame(new_data_dict).to_csv(csv_filepath, index=False)
            print(f"Created new file and appended {len(new_data_dict['sequence'])} new records.")
        else:
            new_df = pd.DataFrame(new_data_dict)
            new_df.to_csv(csv_filepath, mode='a', header=False, index=False)
            print(f"Appended {len(new_df)} new records to {csv_filepath}.")
