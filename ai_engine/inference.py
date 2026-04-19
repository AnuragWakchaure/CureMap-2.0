import torch
import joblib
import numpy as np
import pandas as pd
from ai_engine.train_vae import CureMapVAE # Import your class
from ai_engine.train_predictor import CureMapPredictor # Import your class

class CureMapInference:
    def __init__(self):
        # 1. Load the Scaler
        self.scaler = joblib.load('output/scaler.pkl')
        self.top_genes = pd.read_csv('output/final_features.csv', index_col=0).columns.tolist()
        # 2. Load the VAE (Encoder only)
        # Assuming 5000 input genes and 128 latent dim
        self.vae = CureMapVAE(input_dim=5000, latent_dim=128)
        self.vae.load_state_dict(torch.load('output/vae_model.pth'))
        self.vae.eval()
        
        # 3. Load the Predictor
        self.predictor = CureMapPredictor(input_dim=1152) # 128 + 1024
        self.predictor.load_state_dict(torch.load('output/curemap_predictor.pth'))
        self.predictor.eval()
        
        # 4. Load Drug Fingerprints
        self.drug_map = joblib.load('output/drug_fingerprints.pkl')

    def predict(self, raw_gene_values, drug_name):
        # Convert list to DataFrame with correct column names to silence warning
        gene_log = np.log2(np.array(raw_gene_values) + 1).reshape(1, -1)
        gene_df = pd.DataFrame(gene_log, columns=self.top_genes) 
        
        gene_scaled = self.scaler.transform(gene_df)
        gene_tensor = torch.tensor(gene_scaled, dtype=torch.float32)
        # B. Get Latent Signature
        with torch.no_grad():
            _, mu, _ = self.vae(gene_tensor)
            patient_vector = mu.numpy()
        
        # C. Get Drug Fingerprint
        if drug_name not in self.drug_map:
            return {"error": "Drug not found in database"}
        drug_vector = self.drug_map[drug_name].reshape(1, -1)
        
        # D. Final Prediction
        combined_input = np.concatenate([patient_vector, drug_vector], axis=1)
        with torch.no_grad():
            prediction = self.predictor(torch.tensor(combined_input, dtype=torch.float32))
        
        return {
            "score": prediction.item(),
            "latentVector": patient_vector.flatten().tolist()
        }
    # Add this at the bottom of inference.py
if __name__ == "__main__":
    # 1. Initialize the engine
    engine = CureMapInference()
    print("--- Model Engine Loaded Successfully ---")

    # 2. Create dummy data (5000 random gene values for testing)
    dummy_genes = np.random.rand(5000).tolist()
    
    # 3. Try a prediction
    test_drug = "Cisplatin" # Use a drug you know was mapped
    result = engine.predict(dummy_genes, test_drug)
    
    print(f"Test Result for {test_drug}: {result}")

# Example Usage:
# engine = CureMapInference()
# result = engine.predict(my_5000_genes, "Cisplatin")
# print(f"Predicted Response (LN_IC50): {result}")