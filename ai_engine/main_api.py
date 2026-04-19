from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine.inference import CureMapInference
import uvicorn

# 1. Initialize FastAPI and your AI Engine
app = FastAPI(title="CureMap AI Engine")
engine = CureMapInference()

# Add CORS middleware to allow requests from your Node.js/React stack
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the Request Data Model
class PredictRequest(BaseModel):
    features: list  # This will be your 5000 genomic floats
    drug: str

@app.get("/")
def read_root():
    return {"status": "CureMap AI Engine is Online"}

@app.post("/predict")
async def predict(request: PredictRequest):
    try:
        features = request.features
        drug = request.drug
        
        # --- NEW: SHAPE FIX LOGIC ---
        EXPECTED_SIZE = 5000
        current_size = len(features)
        
        if current_size < EXPECTED_SIZE:
            # Add zeros to the end if the CSV is too small
            print(f"[Fix] Padding data: {current_size} -> {EXPECTED_SIZE}")
            features = features + [0.0] * (EXPECTED_SIZE - current_size)
        elif current_size > EXPECTED_SIZE:
            # Trim the data if the CSV is too large
            print(f"[Fix] Trimming data: {current_size} -> {EXPECTED_SIZE}")
            features = features[:EXPECTED_SIZE]
        # -----------------------------

        print(f"--- AI INFERENCE START ---")
        print(f"Drug Target: {drug} | Final Feature Count: {len(features)}")
        
        result = engine.predict(features, drug)
        
        if isinstance(result, dict) and "error" in result:
            return {"error": result["error"], "status": "failed"}
        
        score = result.get("score", 0.0)
        latentVector = result.get("latentVector", [])
        
        interpretation = "Sensitive" if score < 5.0 else "Resistant"
        
        return {
            "score": round(float(score), 4),
            "interpretation": interpretation,
            "drug": drug,
            "latentVector": latentVector,
            "status": "success"
        }

    except Exception as e:
        print(f"!!! CRITICAL AI ERROR: {str(e)}")
        return {"error": str(e), "status": "failed"}

# 6. Run the server on Port 8000
# (Matches the AI_URL in your corrected records.js)
if __name__ == "__main__":
    print("Starting CureMap AI Engine on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)