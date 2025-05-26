// This file defines the routes related to embedding functionalities.
// It exports functions that handle requests for embedding data.

import express from 'express';
import multer from 'multer';
import { createEmbedding } from '../services/embeddingService.js';

const router = express.Router();
const upload = multer({ dest: 'data/uploads' });

// Route to create an embedding
router.post('/', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const embedding = await createEmbedding(req.file);
        res.status(201).json(embedding);
    } catch (error) {
        console.error('Error creating embedding:', error);
        res.status(500).json({ message: 'Error creating embedding', error });
    }
});

// Route to get an embedding by ID
router.get('/:id', async (req, res) => {
    try {
        const embeddingId = req.params.id;
        const embedding = await embeddingService.getEmbeddingById(embeddingId);
        if (!embedding) {
            return res.status(404).json({ message: 'Embedding not found' });
        }
        res.status(200).json(embedding);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving embedding', error });
    }
});

// Export the router
export default router;