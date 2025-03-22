// api/tasks.js
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const connectDB = require('../config/db'); // Adjusted import

connectDB();

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        await authMiddleware(req, res, () => { });
    } catch (error) {
        return;
    }

    const { method, url } = req;
    const id = url.split('/').pop();

    if (method === 'GET' && url === '/api/tasks') {
        try {
            const tasks = await Task.find({ user: req.user.id });
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else if (method === 'POST' && url === '/api/tasks') {
        const { title, description } = req.body;
        try {
            const task = new Task({ title, description, user: req.user.id });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else if (method === 'PUT' && id) {
        const { title, description, status } = req.body;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid task ID' });
            }
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            await task.save();
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else if (method === 'DELETE' && id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid task ID' });
            }
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

            await task.deleteOne();
            res.status(200).json({ message: 'Task removed' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};