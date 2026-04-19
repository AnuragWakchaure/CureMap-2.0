

```markdown
# CureMap: Mapping Cancer Drug Response using Multi-Omics

**CureMap** is an intelligent framework designed to predict oncology drug sensitivity (expressed as $IC_{50}$ values) by integrating high-dimensional multi-omics data with machine learning.

---

## 🏗️ System Architecture
The project is divided into three distinct services that must be running simultaneously:

1.  **AI Engine (FastAPI):** Handles the heavy lifting of Variational Autoencoders and Random Forest predictions.
2.  **Server (Node.js/Express):** Manages the database, user history, and patient records.
3.  **Client (React):** The interactive dashboard for researchers.

---

## ⚙️ Installation & Deployment

### 🟢 Step 1: AI Engine (The Brain)
Navigate to the root directory and install Python dependencies.
```bash
pip install fastapi uvicorn torch pandas numpy scikit-learn
python main_api.py
```

### 🔵 Step 2: Backend API (The Bridge)
Connects the AI logic to the database.
```bash
cd backend
npm install
node index.js
```

### 🟡 Step 3: Frontend Dashboard (The Interface)
Launch the user interface.
```bash
cd curemap-frontend
npm install
npm run dev
```

---

## 📁 Repository Map
```text
CureMap/
├── curemap-frontend/    # React (Vite) Client
├── backend/             # Node.js Server
├── main_api.py          # FastAPI AI Endpoint
├── inference.py         # Model Logic
└── train_predictor.py   # ML Training Script
```

---

## 🧪 How to Run a Prediction
1. **Input:** Enter a Patient ID and choose a drug (e.g., *Cisplatin*).
2. **Data:** Upload a genomic CSV (expression levels).
3. **Output:** The system calculates the $IC_{50}$ score and visualizes key biomarkers like **TP53** or **BRCA1**.

---

## 👨‍💻 Developed By
**Anurag Adinath Wakchaure** *Information Technology Engineering* Amrutvahini College of Engineering (AVCOE), Sangamner
```
