import pandas as pd
import numpy as np

# Generate 5,000 random genomic values
data = np.random.uniform(0, 15, 5000)

# Save as a single row CSV (No header)
df = pd.DataFrame([data])
df.to_csv("perfect_patient.csv", index=False, header=False)

print("Created 'perfect_patient.csv' with 5,000 features!")