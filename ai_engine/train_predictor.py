import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# 1. Define the Predictor Architecture
class CureMapPredictor(nn.Module):
    def __init__(self, input_dim):
        super(CureMapPredictor, self).__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            
            nn.Linear(256, 128),
            nn.ReLU(),
            
            nn.Linear(128, 1) # Output: Predicted LN_IC50
        )

    def forward(self, x):
        return self.layers(x)

def train_engine():
    print("--- Phase 3: Training the Prediction Engine ---")
    
    # 2. Load the fused dataset
    data = pd.read_csv('output/final_curemap_dataset.csv')
    X = data.iloc[:, :-1].values # All columns except last
    y = data.iloc[:, -1].values  # Last column (LN_IC50)

    # Change 'test_test_split' to 'test_size'
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Convert to Tensors
    train_ds = TensorDataset(torch.tensor(X_train, dtype=torch.float32), torch.tensor(y_train, dtype=torch.float32).view(-1, 1))
    test_ds = TensorDataset(torch.tensor(X_test, dtype=torch.float32), torch.tensor(y_test, dtype=torch.float32).view(-1, 1))
    
    train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_ds, batch_size=64)

    # 4. Initialize Model
    model = CureMapPredictor(input_dim=X.shape[1])
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    # 5. Training Loop
    epochs = 30
    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0
        for batch_x, batch_y in train_loader:
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        # Validation
        model.eval()
        val_loss = 0
        with torch.no_grad():
            for bx, by in test_loader:
                val_loss += criterion(model(bx), by).item()
        
        if epoch % 5 == 0 or epoch == 1:
            print(f"Epoch {epoch} | Train MSE: {total_loss/len(train_loader):.4f} | Val MSE: {val_loss/len(test_loader):.4f}")

    # 6. Save the Final Model
    torch.save(model.state_dict(), 'output/curemap_predictor.pth')
    print("\n[SUCCESS] Prediction Engine trained and saved to output/curemap_predictor.pth")

if __name__ == "__main__":
    train_engine()