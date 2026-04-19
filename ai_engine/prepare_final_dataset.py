import pandas as pd
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem

def smiles_to_fp(smiles, radius=2, n_bits=1024):
    try:
        mol = Chem.MolFromSmiles(smiles)
        return np.array(AllChem.GetMorganFingerprintAsBitVect(mol, radius, n_bits))
    except:
        return np.zeros(n_bits)

def prepare_final_data():
    print("--- Phase 2: Fusing Patient and Drug Data ---")

    # 1. Load Patient Signatures
    patient_df = pd.read_csv('output/patient_latent_signatures.csv', index_col=0)
    
    # 2. Load GDSC Responses
    # Note: Ensure your GDSC file has 'cell_line_id', 'drug_smiles', and 'ln_ic50'
    gdsc = pd.read_csv('output/aligned_gdsc.csv') 

    # 3. Create Drug Fingerprints
    print("Generating drug fingerprints from SMILES...")
    unique_smiles = gdsc['drug_smiles'].unique()
    smiles_map = {s: smiles_to_fp(s) for s in unique_smiles}
    
    # 4. Merge Everything
    final_rows = []
    for _, row in gdsc.iterrows():
        cell_id = row['cell_line_id']
        smiles = row['drug_smiles']
        ic50 = row['ln_ic50']
        
        if cell_id in patient_df.index:
            p_feat = patient_df.loc[cell_id].values
            d_feat = smiles_map[smiles]
            # Concatenate [Patient Features] + [Drug Features]
            combined = np.concatenate([p_feat, d_feat, [ic50]])
            final_rows.append(combined)

    final_data = pd.DataFrame(final_rows)
    # The last column is our target (IC50)
    final_data.to_csv('output/final_training_set.csv', index=False)
    print(f"Final dataset prepared with {len(final_data)} samples.")

if __name__ == "__main__":
    prepare_final_data()