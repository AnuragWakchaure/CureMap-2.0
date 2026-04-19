const router = require('express').Router();
const Record = require('../models/Record');
const axios = require('axios');

router.post('/predict', async (req, res) => {
    // FORCE LOG TO TERMINAL IMMEDIATELY
    console.log("\n******************************************");
    console.log("[Node] ALERT: Predict request received!");
    
    try {
        const { patientName, drug, features, userId, cancerType } = req.body;

        // Log the incoming data
        console.log(`[Node] Patient: ${patientName || "MISSING"}`);
        console.log(`[Node] Drug: ${drug || "MISSING"}`);
        console.log(`[Node] Features Count: ${features ? features.length : "UNDEFINED"}`);

        if (!features || features.length === 0) {
            console.error("[Node] Error: Features array is empty or undefined.");
            return res.status(400).json({ message: "Genomic data is missing" });
        }

        // --- CALL AI ENGINE (Ensure port matches your Python terminal) ---
        const AI_URL = "http://127.0.0.1:8000/predict"; // Changed from 8001 back to 8000
        
        console.log(`[Node] Contacting AI at ${AI_URL}...`);
        
        const aiResponse = await axios.post(AI_URL, {
            features: features,
            drug: drug
        });

        console.log("[Node] AI Response Received:", aiResponse.data);

        // --- MAP DATA TO SCHEMA ---
        // Safeguard: Use fallbacks (||) so the DB doesn't crash on null values
        const newRecord = new Record({
            userId: userId || "anonymous_user", 
            patientName: patientName || "Unknown Patient",
            cancerType: cancerType || "Oncology Study",
            drugName: aiResponse.data.drug || drug,
            ic50Score: aiResponse.data.score || aiResponse.data.prediction || 0, 
            interpretation: aiResponse.data.interpretation || aiResponse.data.status || "Inconclusive",
            latentSignature: aiResponse.data.latentVector || [] 
        });

        console.log("[Node] Saving record to MongoDB...");
        const savedRecord = await newRecord.save();
        
        console.log("[Node] Success! Sending response to React.");
        return res.status(200).json(savedRecord);

    } catch (error) {
        // Detailed error logging
        console.error("!!! [Node] CRITICAL ERROR:");
        console.error("Message:", error.message);
        
        if (error.response) {
            // This happens if the Python AI returned an error (like 422 or 500)
            console.error("AI Engine Error Data:", error.response.data);
            return res.status(500).json({ message: "AI Engine error", detail: error.response.data });
        }

        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET HISTORY
router.get('/history/:userId', async (req, res) => {
    try {
        const records = await Record.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

module.exports = router;