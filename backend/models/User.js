const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    institution: { type: String, default: "AVCOE Sangamner" },
    profilePic: { type: String, default: "" }, // Base64 or URL
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);