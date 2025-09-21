import sys
import os
import pandas as pd
import re
import logging
from eukaryotic_pipeline import EukaryoticPipeline


project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


PIPELINE_DIR = os.path.dirname(os.path.abspath(__file__))


DATASET_FILES = [
    os.path.join(PIPELINE_DIR, 'combined_sequences_final_please_thakkgyahu_part2.csv'),
    os.path.join(PIPELINE_DIR, 'LSU_eukaryote_rRNA_updated.csv'),
    os.path.join(PIPELINE_DIR, 'cleaned_SSU_eukaryote_rRNA.csv'),
    os.path.join(PIPELINE_DIR, 'its_refseq_fungi.csv')
]
MERGED_DATA_PATH = os.path.join(PIPELINE_DIR, 'temp_merged_training_data.csv')
PIPELINE_SAVE_PATH = os.path.join(PIPELINE_DIR, 'eukaryote_classifier_pipeline_full_data')


MIN_SAMPLES_PER_GENUS = 5


if __name__ == "__main__":
    
    logging.info("--- Starting Data Merging and Filtering Process ---")
    if not os.path.exists(MERGED_DATA_PATH):
        
        for f in DATASET_FILES:
            if not os.path.exists(f):
                raise FileNotFoundError(f"Dataset file not found: {f}.")

        list_of_dfs = []
        for f in DATASET_FILES:
            logging.info(f"Reading {f}...")
            try:
                df = pd.read_csv(f, usecols=['scientific_name', 'sequence'], low_memory=False)
                list_of_dfs.append(df)
            except ValueError:
                logging.warning(f"Could not find required columns in {f}. Skipping.")

        if not list_of_dfs:
            raise ValueError("No valid data files found to merge.")

        logging.info("Merging datasets...")
        merged_df = pd.concat(list_of_dfs, ignore_index=True)
        merged_df.drop_duplicates(subset=['sequence'], inplace=True)
        merged_df.dropna(subset=['scientific_name', 'sequence'], inplace=True)
        
        logging.info("\nFiltering dataset to create a high-quality training set...")
        
        merged_df['genus'] = merged_df['scientific_name'].apply(
            lambda d: re.match(r'^\s*([A-Za-z]+)', d).group(1) if isinstance(d, str) and re.match(r'^\s*([A-Za-z]+)', d) else "Unknown"
        )
        merged_df = merged_df[merged_df['genus'] != "Unknown"]

        genus_counts = merged_df['genus'].value_counts()
        genera_to_keep = genus_counts[genus_counts >= MIN_SAMPLES_PER_GENUS].index
        
        logging.info(f"Original number of unique genera: {len(genus_counts)}")
        logging.info(f"Number of genera with at least {MIN_SAMPLES_PER_GENUS} samples: {len(genera_to_keep)}")

        filtered_df = merged_df[merged_df['genus'].isin(genera_to_keep)]
        
        logging.info(f"Saving filtered data with {len(filtered_df)} unique sequences to {MERGED_DATA_PATH}...")
        
        filtered_df[['scientific_name', 'sequence']].to_csv(MERGED_DATA_PATH, index=False)
        logging.info("--- Data Merging and Filtering Complete ---")
    else:
        logging.info(f"Using existing merged data file found at: {MERGED_DATA_PATH}")

    pipeline = EukaryoticPipeline(k_mer_size=8)

    logging.info("\n--- Starting Pipeline Training on Filtered Dataset ---")

    training_df = pd.read_csv(MERGED_DATA_PATH)
    
    pipeline.train(
        dataframe=training_df, 
        model_type='CNN'
    )

    pipeline.save_pipeline(PIPELINE_SAVE_PATH)

    logging.info(f"\nTraining complete. A high-accuracy pipeline has been saved to: '{PIPELINE_SAVE_PATH}'")