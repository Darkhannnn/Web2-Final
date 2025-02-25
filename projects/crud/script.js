const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();
const MONGO_URI = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error while connecting to MongoDB:', err));

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: String,
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'projects', 'crud', 'index.html'));
});

router.post('/blogs', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body is required' });
        }
        const blog = new Blog({ title, body, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Пост не найден' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/blogs/:id', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, body, author }, { new: true });
        if (!blog) return res.status(404).json({ message: 'Post not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/blogs/all', async (req, res) => {
    try {
        const result = await Blog.deleteMany({});
        res.json({ message: `Posts deleted: ${result.deletedCount}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
