import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import pandas as pd
import numpy as np

# 1. Define the VAE Architecture
class CureMapVAE(nn.Module):
    def __init__(self, input_dim, latent_dim=128):
        super(CureMapVAE, self).__init__()
        # Encoder
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 1024),
            nn.ReLU(),
            nn.Linear(1024, 512),
            nn.ReLU()
        )
        self.fc_mu = nn.Linear(512, latent_dim)
        self.fc_logvar = nn.Linear(512, latent_dim)
        
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 512),
            nn.ReLU(),
            nn.Linear(512, 1024),
            nn.ReLU(),
            nn.Linear(1024, input_dim)
        )

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        h = self.encoder(x)
        mu, logvar = self.fc_mu(h), self.fc_logvar(h)
        z = self.reparameterize(mu, logvar)
        return self.decoder(z), mu, logvar

# 2. Loss Function (MSE + KL Divergence)
def loss_function(recon_x, x, mu, logvar):
    BCE = nn.functional.mse_loss(recon_x, x, reduction='sum')
    KLD = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return BCE + KLD

# 3. Training Loop
def train_vae():
    # Load data
    data = pd.read_csv('output/final_features.csv', index_col=0)
    X = torch.tensor(data.values, dtype=torch.float32)
    dataset = TensorDataset(X)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    input_dim = X.shape[1]
    model = CureMapVAE(input_dim)
    optimizer = optim.Adam(model.parameters(), lr=1e-3)

    epochs = 50
    print(f"Starting training for {epochs} epochs...")
    
    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0
        for batch in dataloader:
            batch_data = batch[0]
            optimizer.zero_grad()
            recon_batch, mu, logvar = model(batch_data)
            loss = loss_function(recon_batch, batch_data, mu, logvar)
            loss.backward()
            train_loss += loss.item()
            optimizer.step()
        
        if epoch % 10 == 0:
            print(f'Epoch {epoch}, Average Loss: {train_loss / len(dataset):.4f}')

    # Save the trained model and the latent features
    torch.save(model.state_dict(), 'output/vae_model.pth')
    
    # Generate and save the compressed "Patient Signatures"
    model.eval()
    with torch.no_grad():
        _, mu, _ = model(X)
        latent_df = pd.DataFrame(mu.numpy(), index=data.index)
        latent_df.to_csv('output/patient_latent_signatures.csv')
    
    print("Training complete! Patient signatures saved.")

if __name__ == "__main__":
    train_vae()