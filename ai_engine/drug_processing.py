import pandas as pd
import numpy as np
import pubchempy as pcp
from rdkit import Chem
from rdkit.Chem import AllChem
import time
import os
import joblib

def smiles_to_fp(smiles, radius=2, n_bits=1024):
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol:
            fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius, nBits=n_bits)
            return np.array(fp)
    except:
        pass
    return None

def process_drugs_and_fuse():
    print("--- Phase 2: Drug Processing & Data Fusion ---")
    
    # Files
    gdsc_path = 'output/aligned_gdsc.csv'
    latent_path = 'output/patient_latent_signatures.csv'
    drug_map_cache = 'output/drug_fingerprints.pkl'

    gdsc = pd.read_csv(gdsc_path)
    patient_latent = pd.read_csv(latent_path, index_col=0)
    
    # 1. Handle Drug Fingerprints (With Cache)
    if os.path.exists(drug_map_cache):
        print("Loading drug fingerprints from cache...")
        drug_map = joblib.load(drug_map_cache)
    else:
        unique_drugs = gdsc['DRUG_NAME'].unique()
        drug_map = {}
        print(f"Found {len(unique_drugs)} unique drugs. Fetching from PubChem...")
        for drug in unique_drugs:
            try:
                compounds = pcp.get_compounds(drug, 'name')
                if compounds:
                    smiles = compounds[0].canonical_smiles
                    fp = smiles_to_fp(smiles)
                    if fp is not None:
                        drug_map[drug] = fp
                        print(f"[SUCCESS] {drug} mapped.")
                time.sleep(0.2)
            except:
                print(f"[ERROR] {drug} failed.")
        joblib.dump(drug_map, drug_map_cache)

    # 2. Fuse Data (CRITICAL FIX: Using 'mapped_id' instead of 'COSMIC_ID')
    print("\nFusing Patient Signatures with Drug Fingerprints...")
    final_rows = []
    
    # Print a sample of IDs to verify
    print(f"Sample Patient ID from VAE: {patient_latent.index[0]}")
    print(f"Sample 'mapped_id' from GDSC: {gdsc['mapped_id'].iloc[0]}")

    for _, row in gdsc.iterrows():
        # Change this to 'mapped_id' to match the ACH-XXXXXX format
        cell_id = str(row['mapped_id']) 
        drug_name = row['DRUG_NAME']
        target_ic50 = row['LN_IC50']
        
        if cell_id in patient_latent.index and drug_name in drug_map:
            p_feat = patient_latent.loc[cell_id].values
            d_feat = drug_map[drug_name]
            combined = np.concatenate([p_feat, d_feat, [target_ic50]])
            final_rows.append(combined)

    # 3. Save the Final Training Set
    if len(final_rows) > 0:
        final_df = pd.DataFrame(final_rows)
        final_df.to_csv('output/final_curemap_dataset.csv', index=False)
        print(f"\n--- Phase 2 Complete ---")
        print(f"Total samples for training: {len(final_df)}")
    else:
        print("\n[STILL 0 SAMPLES] Double check if 'mapped_id' in GDSC matches the index of patient_latent_signatures.csv")

if __name__ == "__main__":
    process_drugs_and_fuse()