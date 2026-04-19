const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json("Account created successfully");
    } catch (err) { res.status(500).json(err); }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Invalid credentials");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SEC);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;