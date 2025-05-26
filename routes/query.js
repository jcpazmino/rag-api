/* 
✅ Recibir una pregunta del usuario
🔍 Generar su embedding
📡 Consultar en ChromaDB por similitud
📄 Devolver los fragmentos más relevantes con su metadato
 */

import express from 'express';
import OpenAI from 'openai';
import { queryCollection } from '../services/chromaService.js';

const router = express.Router();

const COLLECTION_NAME = 'documentos_rag';

router.post('/', async (req, res) => {
  const { pregunta, n } = req.body;
  if (!pregunta) return res.status(400).json({ error: 'Falta la pregunta' });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const embedding = await getQueryEmbedding(pregunta, openai);
    const result = await queryCollection(COLLECTION_NAME, embedding, n || 3);

    res.json(result);
  } catch (err) {
    console.error('❌ Error en /query:', err.message);
    res.status(500).json({ error: 'Error al realizar la búsqueda semántica.' });
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
