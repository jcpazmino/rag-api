/* 
✅ Recibir una pregunta del usuario
🔍 Generar su embedding
📡 Consultar en ChromaDB por similitud
📄 Devolver los fragmentos más relevantes con su metadato
 */

import express from 'express';
import OpenAI from 'openai';
import { queryCollection, getCollectionIdByName, listDocumentsInCollection, deleteCollection, createCollection } from '../services/rag/chromaService.js';

const router = express.Router();
router.use(express.json());

const COLLECTION_NAME = 'documentos_rag';

router.post('/', async (req, res) => {
  const { pregunta, n } = req.body;
  if (!pregunta) return res.status(400).json({ error: 'Falta la pregunta' });

  try {

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const embedding = await getQueryEmbedding(pregunta, openai);


    const collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (!collectionId) return res.status(404).json({ error: 'Colección no encontrada' });


    const result = await queryCollection(collectionId, embedding, n || 3);


    res.json(result);
  } catch (err) {
    console.error('❌ Error en /query:', err);
    res.status(500).json({ error: 'Error al realizar la búsqueda semántica.' });
  }
});

// Nuevo endpoint para listar documentos de la colección
router.get('/documentos', async (req, res) => {
  try {
    const collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (!collectionId) return res.status(404).json({ error: 'Colección no encontrada' });

    const documentos = await listDocumentsInCollection(collectionId);
    res.json(documentos);
  } catch (err) {
    console.error('❌ Error al listar documentos:', err);
    res.status(500).json({ error: 'Error al listar documentos.' });
  }
});

router.post('/reiniciar-coleccion', async (req, res) => {
  try {
    let collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (collectionId) {
      try {
        await deleteCollection(collectionId);
      } catch (err) {
        // Si es 404, ignora el error
        if (err.response && err.response.status !== 404) throw err;
      }
      // Espera un momento para asegurar que la colección se borre
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // Verifica de nuevo si la colección existe antes de crearla
    collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (!collectionId) {
      await createCollection(COLLECTION_NAME);
    }
    res.json({ message: 'Colección reiniciada correctamente.' });
  } catch (err) {
    console.error('❌ Error al reiniciar la colección:', err);
    res.status(500).json({ error: 'Error al reiniciar la colección.' });
  }
});

async function getQueryEmbedding(text, openai) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}
export default router;
