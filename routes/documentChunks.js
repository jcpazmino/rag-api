import express from 'express';
import {
  addChunk,
  getAllChunks,
  getChunksByDocument,
  getChunkById,
  updateChunk,
  deleteChunk
} from '../services/rag/documentChunkService.js';

const router = express.Router();

// Crear chunk
router.post('/', async (req, res) => {
  try {
    const chunk = await addChunk(req.body);
    res.status(201).json(chunk);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear chunk.' });
  }
});

// Listar todos los chunks
router.get('/', async (req, res) => {
  try {
    const chunks = await getAllChunks();
    res.json(chunks);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar chunks.' });
  }
});

// Listar chunks por documento
router.get('/document/:document_id', async (req, res) => {
  try {
    const chunks = await getChunksByDocument(req.params.document_id);
    res.json(chunks);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar chunks por documento.' });
  }
});

// Obtener chunk por ID
router.get('/:id', async (req, res) => {
  try {
    const chunk = await getChunkById(req.params.id);
    if (!chunk) return res.status(404).json({ error: 'No encontrado' });
    res.json(chunk);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener chunk.' });
  }
});

// Modificar chunk
router.put('/:id', async (req, res) => {
  try {
    const chunk = await updateChunk(req.params.id, req.body);
    res.json(chunk);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar chunk.' });
  }
});

// Borrar chunk
router.delete('/:id', async (req, res) => {
  try {
    await deleteChunk(req.params.id);
    res.json({ message: 'Chunk eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar chunk.' });
  }
});

export default router;