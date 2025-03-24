// api/auth.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');

connectDB();

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (req.path === '/api/auth/register') {
            try {
                let user = await User.findOne({ email });
                if (user) return res.status(400).json({ message: 'User already exists' });

                user = new User({ email, password });
                await user.save();

                const payload = { user: { id: user.id } };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.status(200).json({ token });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        } else if (req.path === '/api/auth/login') {
            try {
                const user = await User.findOne({ email });
                if (!user) return res.status(400).json({ message: 'Invalid credentials' });

                const isMatch = await user.matchPassword(password);
                if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

                const payload = { user: { id: user.id } };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.status(200).json({ token });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};