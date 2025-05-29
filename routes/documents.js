import express from 'express';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  enviaFile
} from '../services/rag/documentService.js';

const router = express.Router();

// Crear documento
router.post('/', async (req, res) => {
  try {
    const doc = await addDocument(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear documento.' });
  }
});

// Listar documentos
router.get('/', async (req, res) => {
  try {
    const docs = await getAllDocuments();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar documentos.' });
  }
});

// Obtener documento por ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener documento.' });
  }
});

// Modificar documento
router.put('/:id', async (req, res) => {
  try {
    const doc = await updateDocument(req.params.id, req.body);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar documento.' });
  }
});

// Borrar documento
router.delete('/:id', async (req, res) => {
  try {
    await deleteDocument(req.params.id);
    res.json({ message: 'Documento eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar documento.' });
  }
});

// Descargar archivo PDF por query param file_name
router.get('/download', (req, res) => {
  const fileName = req.query.file_name;
  if (!fileName) {
    return res.status(400).json({ error: 'El parámetro file_name es requerido.' });
  }
  console.log('Enviando archivo:', `data/uploads/pdf/${fileName}`);
  enviaFile(res, fileName);
});

export default router;