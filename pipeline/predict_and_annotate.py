import json
import os
import pandas as pd
from eukaryotic_pipeline import EukaryoticPipeline
from Bio import Entrez
from dotenv import load_dotenv
import time
from datetime import datetime

load_dotenv()

PIPELINE_SAVE_PATH = 'eukaryote_classifier_pipeline'
BLAST_RESULTS_PATH = r'LSU_eukaryote_final_rRNA-blastn.csv'
ENTREZ_EMAIL = os.getenv("ENTREZ_EMAIL")

if not ENTREZ_EMAIL or "@" not in ENTREZ_EMAIL:
    print("--- CONFIGURATION ERROR ---")
    print("FATAL: Your NCBI email address is not configured correctly in the .env file.")
    print("Please create a file named '.env' in the same directory and add the following line:")
    print('ENTREZ_EMAIL="your.email@example.com"')
    exit()

def get_taxid_from_name(genus_name):
    try:
        Entrez.email = ENTREZ_EMAIL
        handle = Entrez.esearch(db="taxonomy", term=genus_name, retmax="1")
        record = Entrez.read(handle)
        handle.close()
        if record["IdList"]:
            return record["IdList"][0]
        return None
    except Exception as e:
        print(f"Warning: Could not fetch taxid for '{genus_name}'. Error: {e}")
        return None

def get_taxonomy_from_taxid(taxid):
    if not taxid or pd.isna(taxid):
        return None
    try:
        Entrez.email = ENTREZ_EMAIL
        handle = Entrez.efetch(db="taxonomy", id=str(int(taxid)), retmode="xml")
        records = Entrez.read(handle)
        handle.close()
        if not records: return None
        
        lineage = records[0].get('LineageEx', [])
        full_lineage = {rank['Rank']: rank['ScientificName'] for rank in lineage}
        full_lineage[records[0]['Rank']] = records[0]['ScientificName']
        
        standard_ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']
        lineage_data = {rank: full_lineage.get(rank, 'N/A') for rank in standard_ranks}
        lineage_data['ncbi_taxonomy_link'] = f"https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id={taxid}"
        return lineage_data
    except Exception as e:
        print(f"Warning: Could not fetch taxonomy for taxid {taxid}. Error: {e}")
        return None

def build_blast_lookup(blast_filepath):
    print(f"Building local BLAST annotation database from {blast_filepath}...")
    try:
        blast_df = pd.read_csv(
            blast_filepath,
            usecols=['query_sequence', 'subject_scientific_name', 'percentage_identity', 'expect_value', 'subject_taxid'],
            low_memory=False
        )
        blast_df.dropna(inplace=True)
        blast_df.sort_values(by=['query_sequence', 'expect_value', 'percentage_identity'], ascending=[True, True, False], inplace=True)
        best_hits_df = blast_df.drop_duplicates(subset='query_sequence', keep='first')
        lookup_dict = best_hits_df.set_index('query_sequence').to_dict(orient='index')
        print(f"Annotation database ready with {len(lookup_dict)} unique sequences.")
        return lookup_dict
    except FileNotFoundError:
        print(f"Warning: BLAST results file not found at '{blast_filepath}'. Annotation will be skipped for novel taxa.")
        return None
    except Exception as e:
        print(f"Warning: Could not process BLAST file. Error: {e}")
        return None

def read_sequences_from_file(filepath):
    _, extension = os.path.splitext(filepath)
    extension = extension.lower()
    
    try:
        if extension in ['.fasta', '.fa', '.fna']:
            print(f"Detected FASTA file format.")
            sequences, current_sequence = [], ""
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('>'):
                        if current_sequence: sequences.append(current_sequence)
                        current_sequence = ""
                    else:
                        current_sequence += line
                if current_sequence: sequences.append(current_sequence)
            print(f"Successfully read {len(sequences)} sequences.")
            return sequences, None

        elif extension == '.csv':
            print(f"Detected CSV file format.")
            df = pd.read_csv(filepath, low_memory=False)
            if 'sequence' in df.columns:
                sequences = df['sequence'].dropna().tolist()
                print(f"Successfully read {len(sequences)} sequences from 'sequence' column.")
                return sequences, None
            elif len(df.columns) == 1:
                sequences = df.iloc[:, 0].dropna().tolist()
                print(f"Warning: No 'sequence' column found. Reading from single column '{df.columns[0]}'.")
                return sequences, None
            else:
                return None, f"Could not find a 'sequence' column in the CSV. Detected columns: {list(df.columns)}"
        
        elif extension == '.txt':
            print(f"Detected TXT file format.")
            with open(filepath, 'r') as f:
                sequences = [line.strip() for line in f if line.strip()]
            print(f"Successfully read {len(sequences)} sequences.")
            return sequences, None
        
        else:
            return None, f"Unsupported file extension: '{extension}'. Please use .fasta, .csv, or .txt."

    except FileNotFoundError:
        return None, f"File not found at '{filepath}'"
    except Exception as e:
        return None, f"An error occurred while reading the file: {e}"

def calculate_confidence_summary(prediction_list):
    summary = {
        "Confident Match (90-100%)": 0,
        "Likely Match (60-90%)": 0,
        "Uncertain Match (40-60%)": 0,
        "Low Confidence (20-40%)": 0,
        "Very Low Confidence (0-20%)": 0
    }
    for pred in prediction_list:
        confidence = pred.get('confidence', 0)
        if confidence >= 0.9:
            summary["Confident Match (90-100%)"] += 1
        elif confidence >= 0.6:
            summary["Likely Match (60-90%)"] += 1
        elif confidence >= 0.4:
            summary["Uncertain Match (40-60%)"] += 1
        elif confidence >= 0.2:
            summary["Low Confidence (20-40%)"] += 1
        else:
            summary["Very Low Confidence (0-20%)"] += 1
    return summary

def calculate_abundance_summary(prediction_list):
    abundance = {}
    for pred in prediction_list:
        taxon = pred.get('final_taxonomy', 'Unknown')
        abundance[taxon] = abundance.get(taxon, 0) + 1
    
    summary = {
        "unique_taxa_count": len(abundance),
        "abundance_counts": abundance
    }
    return summary

def format_json_response(status, metadata=None, predictions=None, input_summary=None, confidence_summary=None, abundance_summary=None, message=None):
    response = {
        "status": status,
        "metadata": metadata or {},
        "input_summary": input_summary or {},
        "confidence_summary": confidence_summary or {},
        "abundance_summary": abundance_summary or {},
        "predictions": predictions or []
    }
    if message: response["message"] = message
    return json.dumps(response, indent=4)

if __name__ == "__main__":
    if not os.path.exists(PIPELINE_SAVE_PATH):
        error_message = f"Trained pipeline not found at '{PIPELINE_SAVE_PATH}'. Please run 'train.py' first."
        print(format_json_response(status="error", message=error_message))
    else:
        print("--- Initializing Prediction Environment ---")
        loaded_pipeline = EukaryoticPipeline.load_pipeline(PIPELINE_SAVE_PATH)
        blast_lookup_db = build_blast_lookup(BLAST_RESULTS_PATH)
        
        while True:
            print("\n--- Choose an input method ---")
            print("1: Manually enter a single DNA sequence")
            print("2: Provide the path to a file (FASTA, CSV, or TXT)")
            print("3: Exit")
            
            choice = input("Enter your choice (1-3): ")
            
            sequences_to_classify, error_msg = [], None
            start_time = time.time()

            if choice == '1':
                sequence_input = input("Please paste your DNA sequence (with or without FASTA header) and press Enter:\n")
                if sequence_input.strip():
                    lines = sequence_input.strip().splitlines()
                    cleaned_sequence = "".join(lines[1:]) if lines[0].startswith('>') else "".join(lines)
                    sequences_to_classify.append(cleaned_sequence)
            
            elif choice == '2':
                filepath = input("Enter the path to your file: ")
                sequences_to_classify, error_msg = read_sequences_from_file(filepath)
            
            elif choice == '3':
                print("Exiting program.")
                break
            
            else:
                print("Invalid choice. Please enter a number between 1 and 3.")
                continue

            if error_msg:
                print(format_json_response(status="error", message=error_msg))
            elif sequences_to_classify:
                prediction_json = loaded_pipeline.predict(new_sequences=sequences_to_classify)
                prediction_list = json.loads(prediction_json)
                
                print("Annotating sequences with NCBI taxonomy...")
                for pred in prediction_list:
                    pred['taxonomic_lineage'] = None
                    pred['sequence_length'] = len(pred['sequence'])

                    final_decision = pred['final_taxonomy']
                    
                    if not (final_decision.startswith("Novel_MOTU") or final_decision == "Noise (Outlier)"):
                        pred['classification_type'] = "Confident Match"
                        taxid = get_taxid_from_name(pred['predicted_genus'])
                        pred['taxonomic_lineage'] = get_taxonomy_from_taxid(taxid)
                    
                    else:
                        pred['classification_type'] = "Novel Cluster (MOTU)" if final_decision.startswith("Novel") else "Outlier"
                        if blast_lookup_db:
                            best_hit = blast_lookup_db.get(pred['sequence'])
                            if best_hit:
                                taxid = best_hit.get('subject_taxid')
                                pred['taxonomic_lineage'] = get_taxonomy_from_taxid(taxid)
                                pred['blast_hit'] = {
                                    "closest_relative": best_hit['subject_scientific_name'],
                                    "identity": f"{best_hit['percentage_identity']:.2f}%"
                                }
                
                end_time = time.time()
                
                print("\n\n--- FINAL PREDICTION AND ANNOTATION RESULTS ---")
                
                confidence_summary = calculate_confidence_summary(prediction_list)
                abundance_summary = calculate_abundance_summary(prediction_list)

                metadata = {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "execution_time_seconds": round(end_time - start_time, 2),
                    "model_source": PIPELINE_SAVE_PATH
                }

                final_response = format_json_response(
                    status="success",
                    metadata=metadata,
                    predictions=prediction_list,
                    input_summary={"sequences_provided": len(sequences_to_classify)},
                    confidence_summary=confidence_summary,
                    abundance_summary=abundance_summary
                )
                print(final_response)

