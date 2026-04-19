import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib # For saving the scaler to use later in the MERN backend

def engineer_features(input_path='output/aligned_expression.csv', top_n_genes=5000):
    print("--- Starting Feature Engineering ---")

    # 1. Load the aligned data
    df = pd.read_csv(input_path, index_col=0)
    print(f"Original feature count: {df.shape[1]} genes.")

    # 2. Variance Filtering
    # We keep genes that show the most difference across patients
    variances = df.var(axis=0)
    top_genes = variances.nlargest(top_n_genes).index
    df_filtered = df[top_genes]
    print(f"Filtered to top {top_n_genes} most variable genes.")

    # 3. Log2 Transformation
    # Compresses high values and spreads out low values for better ML learning
    df_log = np.log2(df_filtered + 1)

    # 4. Standard Scaling (Z-score)
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df_log)
    
    # Convert back to DataFrame to keep IDs and column names
    df_final = pd.DataFrame(scaled_data, index=df.index, columns=top_genes)

    # 5. Save the results
    df_final.to_csv('output/final_features.csv')
    joblib.dump(scaler, 'output/scaler.pkl') # Save for the web app
    
    print(f"--- Feature Engineering Complete ---")
    print(f"Final shape: {df_final.shape}")
    print("Files saved: output/final_features.csv and output/scaler.pkl")

if __name__ == "__main__":
    engineer_features()