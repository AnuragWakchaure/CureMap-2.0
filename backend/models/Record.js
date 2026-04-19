const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    cancerType: { type: String, required: true },
    drugName: { type: String, required: true },
    
    // Results from AI
    ic50Score: { type: Number, required: true },
    interpretation: { type: String, required: true }, // Sensitive or Resistant
    
    // We store the 128-dim vector to recreate visuals in History without re-running ML
    latentSignature: { type: [Number], required: true },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);