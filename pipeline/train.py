import pandas as pd
import os
from eukaryotic_pipeline import EukaryoticPipeline
import re


DATASET_FILES = [
    'combined_sequences_final_please_thakkgyahu_part2.csv',
    'LSU_eukaryote_rRNA_updated.csv'
]
MERGED_DATA_PATH = 'temp_merged_training_data.csv'
PIPELINE_SAVE_PATH = 'eukaryote_classifier_pipeline_full_data'

MIN_SAMPLES_PER_GENUS = 20



print("--- Starting Data Merging and Filtering Process ---")
if not os.path.exists(MERGED_DATA_PATH):
    
    for f in DATASET_FILES:
        if not os.path.exists(f):
            raise FileNotFoundError(f"Dataset file not found: {f}.")

    list_of_dfs = []
    for f in DATASET_FILES:
        print(f"Reading {f}...")
        try:
            df = pd.read_csv(f, usecols=['scientific_name', 'sequence'], low_memory=False)
            list_of_dfs.append(df)
        except ValueError:
            print(f"Warning: Could not find required columns in {f}. Skipping.")

    if not list_of_dfs:
        raise ValueError("No valid data files found to merge.")

    print("Merging datasets...")
    merged_df = pd.concat(list_of_dfs, ignore_index=True)
    merged_df.drop_duplicates(subset=['sequence'], inplace=True)
    
    
    print("\nFiltering dataset to improve model accuracy...")
    
    merged_df['genus'] = merged_df['scientific_name'].apply(
        lambda d: re.match(r'^\s*([A-Za-z]+)', d).group(1) if isinstance(d, str) and re.match(r'^\s*([A-Za-z]+)', d) else "Unknown"
    )
    
    merged_df = merged_df[merged_df['genus'] != "Unknown"]

   
    genus_counts = merged_df['genus'].value_counts()
    
    
    genera_to_keep = genus_counts[genus_counts >= MIN_SAMPLES_PER_GENUS].index
    
    print(f"Original number of unique genera: {len(genus_counts)}")
    print(f"Number of genera with at least {MIN_SAMPLES_PER_GENUS} samples: {len(genera_to_keep)}")

    
    filtered_df = merged_df[merged_df['genus'].isin(genera_to_keep)]
    
    print(f"Saving filtered data with {len(filtered_df)} unique sequences to {MERGED_DATA_PATH}...")
    
    filtered_df[['scientific_name', 'sequence']].to_csv(MERGED_DATA_PATH, index=False)
    print("--- Data Merging and Filtering Complete ---")
else:
    print(f"Using existing merged data file found at: {MERGED_DATA_PATH}")



pipeline = EukaryoticPipeline()

print("\n--- Starting Pipeline Training on Filtered Dataset ---")

pipeline.train(
    csv_filepath=MERGED_DATA_PATH, 
    model_type='CNN'
)


pipeline.save_pipeline(PIPELINE_SAVE_PATH)

print(f"\nTraining complete. A high-accuracy pipeline has been saved to: '{PIPELINE_SAVE_PATH}'")

