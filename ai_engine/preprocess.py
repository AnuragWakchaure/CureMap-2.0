import pandas as pd
import numpy as np
import os

# Create output directory if it doesn't exist
if not os.path.exists('output'):
    os.makedirs('output')

def run_alignment():
    print("--- Phase 1: Starting Data Alignment ---")

    # 1. Load Datasets
    print("Loading CCLE Expression data...")
    expr = pd.read_csv('CCLE_expression_full.csv', index_col=0) 
    
    print("Loading GDSC Drug Response data...")
    gdsc = pd.read_csv('GDSC2-dataset.csv')
    
    print("Loading ID mapping (sample_info)...")
    try:
        mapping = pd.read_csv('sample_info.csv')
        
        # --- SMART COLUMN PICKER ---
        map_cols = {col.lower(): col for col in mapping.columns}
        cosmic_col = map_cols.get('cosmic_id') or map_cols.get('cosmicid')
        model_col = map_cols.get('modelid') or map_cols.get('arxspan_id') or map_cols.get('model_id')

        if not cosmic_col or not model_col:
            print(f"[ERROR] Could not find ID columns in sample_info.csv.")
            print(f"Available: {mapping.columns.tolist()}")
            return

        # --- FIX: REMOVE DUPLICATES ---
        # This prevents the InvalidIndexError by ensuring each COSMIC ID appears once
        mapping_clean = mapping.dropna(subset=[cosmic_col, model_col])
        mapping_clean = mapping_clean.drop_duplicates(subset=[cosmic_col])
        
        # Create the dictionary
        id_map = dict(zip(mapping_clean[cosmic_col], mapping_clean[model_col]))
        print(f"Successfully linked {cosmic_col} to {model_col} (cleaned duplicates)")
        
    except FileNotFoundError:
        print("[ERROR] 'sample_info.csv' not found.")
        return

    # 2. Transforming GDSC IDs
    # Based on your previous output, the GDSC file uses 'COSMIC_ID'
    gdsc_source_col = 'COSMIC_ID' 
    if gdsc_source_col not in gdsc.columns:
        # Fallback if the column name is slightly different
        gdsc_source_col = [c for c in gdsc.columns if 'COSMIC' in c.upper()][0]

    gdsc['mapped_id'] = gdsc[gdsc_source_col].map(id_map)
    
    # Remove rows that didn't find a match
    gdsc = gdsc.dropna(subset=['mapped_id'])
    
    print(f"CCLE IDs (Expression): {list(expr.index[:3])}")
    print(f"GDSC Mapped IDs (Drug): {list(gdsc['mapped_id'][:3])}")

    # 3. Finding the Overlap
    # Crucial for multi-omics alignment: only keep IDs present in BOTH datasets
    common_ids = sorted(list(set(expr.index) & set(gdsc['mapped_id'])))
    print(f"\n[SUCCESS] Found {len(common_ids)} matching cell lines between datasets.")

    if len(common_ids) == 0:
        print("[ERROR] Match count is 0. Please check if ID formats match (e.g. 'ACH-000001')")
        return

    # 4. Alignment
    # We sort both to ensure they are in the exact same order
    expr_aligned = expr.loc[common_ids]
    gdsc_aligned = gdsc[gdsc['mapped_id'].isin(common_ids)].copy()

    # 5. Save Processed Data
    expr_aligned.to_csv('output/aligned_expression.csv')
    gdsc_aligned.to_csv('output/aligned_gdsc.csv')
    print("\n--- Phase 1 Complete: Aligned files saved in /output folder ---")

if __name__ == "__main__":
    run_alignment()