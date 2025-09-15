import pandas as pd
import numpy as np
import os
import re
import json
from sklearn.metrics import classification_report
from eukaryotic_pipeline import EukaryoticPipeline
from sklearn.model_selection import train_test_split 


PIPELINE_PATH = 'eukaryote_classifier_pipeline'
MERGED_DATA_PATH = 'temp_merged_training_data.csv'


def validate_pipeline(pipeline_path, data_path):
    """
    Loads a trained pipeline and evaluates its performance on a held-out
    test set to generate a realistic validation report.
    """
   
    if not os.path.exists(pipeline_path):
        raise FileNotFoundError(f"Trained pipeline directory not found at: {pipeline_path}. Please run train.py first.")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Merged data file not found at: {data_path}. Please run train.py to generate it.")

    print("--- Starting Pipeline Validation ---")
    
    
    pipeline = EukaryoticPipeline.load_pipeline(pipeline_path)

    print(f"Loading full dataset from {data_path} for validation...")
    df = pd.read_csv(data_path, low_memory=False)
    
   
    df.dropna(subset=['sequence', 'scientific_name'], inplace=True)
    df['genus'] = df['scientific_name'].apply(lambda d: re.match(r'^\s*([A-Za-z]+)', d).group(1) if isinstance(d, str) and re.match(r'^\s*([A-Za-z]+)', d) else "Unknown")
    
   
    print("Splitting data into training and testing sets for validation...")
 
    try:
        train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['genus'])
    except ValueError:
       
        train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

    print(f"Validation will be performed on an unseen test set of {len(test_df)} sequences.")

  
    known_labels_mask = test_df['genus'].isin(pipeline.label_encoder.classes_)
    df_for_validation = test_df[known_labels_mask]
    
   
    true_labels = df_for_validation['genus'].tolist()
    
    
    sequences_to_predict = df_for_validation['sequence'].tolist()

    print(f"Making predictions on {len(df_for_validation)} known sequences from the test set...")
    
    predictions_json = pipeline.predict(sequences_to_predict, confidence_threshold=0.0)
    predictions_list = json.loads(predictions_json)
    
   
    predicted_labels = [item['predicted_genus'] for item in predictions_list]

    
    print("\n\n--- Classification Performance Report (on Unseen Test Data) ---")
    
    report = classification_report(true_labels, predicted_labels, zero_division=0, labels=np.unique(true_labels + predicted_labels))
    print(report)


if __name__ == "__main__":
    validate_pipeline(PIPELINE_PATH, MERGED_DATA_PATH)

