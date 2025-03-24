// api/tasks.js
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const connectDB = require('../config/db');

connectDB();

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        await authMiddleware(req, res, async () => {
            const { method, path } = req;
            const id = path.split('/').pop();

            if (method === 'GET' && path === '/api/tasks') {
                const tasks = await Task.find({ user: req.user.id });
                res.status(200).json(tasks);
            } else if (method === 'POST' && path === '/api/tasks') {
                const { title, description } = req.body;
                const task = new Task({ title, description, user: req.user.id });
                await task.save();
                res.status(201).json(task);
            } else if (method === 'PUT' && path.startsWith('/api/tasks/')) {
                const { title, description, status } = req.body;
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
            } else if (method === 'DELETE' && path.startsWith('/api/tasks/')) {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid task ID' });
                }
                const task = await Task.findById(id);
                if (!task) return res.status(404).json({ message: 'Task not found' });
                if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

                await task.deleteOne();
                res.status(200).json({ message: 'Task removed' });
            } else {
                res.status(405).json({ message: 'Method not allowed' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};