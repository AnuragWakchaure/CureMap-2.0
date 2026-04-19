
# CureMap: Mapping Cancer Drug Response using Multi-Omics

**CureMap** is an advanced intelligent framework designed to predict oncology drug sensitivity (expressed as $IC_{50}$ values) by integrating high-dimensional genomic features with deep learning. Developed as a part of the Information Technology Engineering curriculum at **Amrutvahini College of Engineering (AVCOE)**, this project bridges the gap between machine learning research and clinical application.

## 🧬 Scientific Background

The goal of this system is to predict the **Half Maximal Inhibitory Concentration ($IC_{50}$)**, which represents the potency of a drug. A lower $IC_{50}$ value indicates that the cancer cell line is more **Sensitive** to the treatment, while a higher value indicates **Resistance**.

The prediction is based on the integration of multi-omic data (Gene Expression, Mutation, and Copy Number Variations), typically processed through a Variational Autoencoder (VAE) to extract a **Latent Signature** of the cancer cell:

$$z = \mu + \sigma \odot \epsilon$$

Where:
* $z$ is the latent representation.
* $\mu$ and $\sigma$ are the learned mean and variance.
* $\epsilon$ is a random noise variable sampled from $N(0, 1)$.

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Recharts |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **AI Engine** | Python 3.10+, FastAPI, Uvicorn |
| **ML Libraries** | PyTorch, Scikit-learn, Pandas, NumPy |

---

## 📁 Project Structure

```text
CureMap/
├── curemap-frontend/    # React application (Dashboard & Visualization)
├── backend/             # Node.js REST API (History & Auth)
├── main_api.py          # FastAPI wrapper for the ML model
├── inference.py         # Logic for model loading and prediction
├── train_predictor.py   # Script used for training the Random Forest/NN
├── data/                # Directory for CSV datasets (ignored by git)
└── .gitignore           # Configuration to skip node_modules and large CSVs
```

---

## 🛠️ Installation & Setup

### 1. AI Engine (FastAPI)
Navigate to the root directory and install Python dependencies:
```bash
pip install fastapi uvicorn torch pandas numpy scikit-learn
python main_api.py
```
*The engine will start on `http://127.0.0.1:8000`*

### 2. Backend (Node.js)
Navigate to the backend folder and install packages:
```bash
cd backend
npm install
node index.js
```
*The server will start on `http://localhost:5000`*

### 3. Frontend (React)
Navigate to the frontend folder and launch the development server:
```bash
cd curemap-frontend
npm install
npm run dev
```
*Access the dashboard at `http://localhost:5173`*

---

## 📊 Usage Guide
1.  **Ingestion:** Enter a unique **Patient ID** and select the **Target Drug** (e.g., Cisplatin, Lapatinib).
2.  **Genomic Profile:** Upload a CSV file containing gene expression data (the model expects 5,000 features).
3.  **Analysis:** Click **"Run CureMap Prediction"**.
4.  **Insights:**
    * **Potency Gauge:** Visualizes the predicted $IC_{50}$ score.
    * **Biomarker Bar Graph:** Displays the top genomic markers (e.g., *TP53*, *EGFR*) that influenced the prediction.
    * **History:** All results are automatically saved to the database for longitudinal review.

---

## 🛡️ License
Distributed under the MIT License.

## 👨‍💻 Developer
**Anurag Wakchaure**
Information Technology Engineering
AVCOE, Sangamner

---

### Pro-Tip for your GitHub
Once you upload this, go to the **"About"** section of your GitHub repository on the right-hand side and add these tags: `machine-learning`, `cancer-research`, `mern-stack`, `bioinformatics`, and `fastapi`. It will make your project much easier for recruiters to find!
