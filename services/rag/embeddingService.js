/* 
✅ Recibe un archivo PDF
📄 Extrae y fragmenta el texto
🧠 Genera embeddings con OpenAI
🗃️ Almacena chunks y metadatos en ChromaDB vía su API REST 
*/

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { encoding_for_model } from 'tiktoken';
import OpenAI from 'openai';
import { getCollectionIdByName, createCollection, addToCollection } from './chromaService.js';
import axios from 'axios';
import crypto from 'crypto';

const encoder = encoding_for_model('text-embedding-3-small');
const router = express.Router();
const uploadDir = 'data/uploads';
const COLLECTION_NAME = 'documentos_rag';

// Asegura que la carpeta exista y sea un directorio
if (fs.existsSync(uploadDir)) {
  const stat = fs.statSync(uploadDir);
  if (!stat.isDirectory()) {
    fs.unlinkSync(uploadDir); // elimina si es un archivo
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} else {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// Función para fragmentar el texto por tokens reales (~800)
function chunkByTokens(text, maxTokens = 800) {
  const words = text.split(/\s+/);
  const chunks = [];
  let chunk = [];
  let tokenCount = 0;

  for (let word of words) {
    const tokens = encoder.encode(word);
    if (tokenCount + tokens.length > maxTokens) {
      chunks.push(chunk.join(' '));
      chunk = [];
      tokenCount = 0;
    }
    chunk.push(word);
    tokenCount += tokens.length;
  }
  if (chunk.length > 0) chunks.push(chunk.join(' '));
  return chunks;
}

async function getEmbedding(text) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// Ruta principal: /embed-pdf
router.post('/', upload.single('pdf'), async (req, res) => {
  const filePath = req.file.path;
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdf(pdfBuffer);
    const text = data.text;

    const chunks = chunkByTokens(text, 800);
    const metadatas = [];
    const embeddings = [];
    const ids = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);
 
      embeddings.push(embedding);
      metadatas.push({ chunk, index: i });
      ids.push(`frag_${Date.now()}_${i}`);
    }

    await addToCollection(COLLECTION_NAME, ids, embeddings, metadatas, chunks);

    res.json({ message: `✅ ${chunks.length} fragmentos procesados y almacenados en Chroma.` });
  } catch (err) {
    console.error('❌ Error en /embed-pdf:', err);
    res.status(500).json({ error: 'Error procesando el PDF.' });
  } finally {
    fs.unlinkSync(filePath); // Limpia el archivo temporal
  }
});

export async function createEmbedding(file) {
  const filePath = file.path;
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdf(pdfBuffer);
    const text = data.text;

    const chunks = chunkByTokens(text, 800);
    const metadatas = [];
    const embeddings = [];
    const ids = [];
    let totalTokens = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);

      const tokens = encoder.encode(chunk);
      totalTokens += tokens.length;

      embeddings.push(embedding);
      metadatas.push({ chunk, index: i, tokens: tokens.length });
      ids.push(`frag_${Date.now()}_${i}`);
    }

    // Obtén el UUID de la colección (o créala si no existe)
    let collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (!collectionId) {
      collectionId = await createCollection(COLLECTION_NAME);
    }

    await addToCollection(collectionId, ids, embeddings, metadatas, chunks);

    return { totalChunks: `${chunks.length}`, totalTokens: totalTokens, collection_id: collectionId, embedding_ids: ids };
  } catch (err) {
    console.error('❌ Error en createEmbedding:', err.response?.data || err);
    throw err;
  } finally {
    fs.unlinkSync(filePath);
  }
}


export default router;

