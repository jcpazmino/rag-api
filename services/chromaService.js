import axios from 'axios';
import OpenAI from 'openai';
import { queryCollection, getCollectionIdByName } from './chromaService.js';

const BASE_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const TENANT = process.env.CHROMA_TENANT || 'default_tenant';
const DATABASE = process.env.CHROMA_DATABASE || 'default_database';

// Configura tu clave de OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function searchInChromaDB(textQuery) {
  // 1. Obtén el UUID de la colección
  const collectionId = await getCollectionIdByName('documentos_rag');
  if (!collectionId) {
    throw new Error('La colección no existe');
  }

  // 2. Genera el embedding de la consulta
  const queryEmbedding = await getEmbedding(textQuery);

  // 3. Realiza la consulta en ChromaDB
  const nResults = 3;
  const result = await queryCollection(collectionId, queryEmbedding, nResults);

  console.log('Resultados de la consulta:', result);
  return result;
}

export async function getCollectionIdByName(name) {
  const res = await axios.get(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`
  );
  console.log('Respuesta de ChromaDB:', res.data); // <-- Agrega este log
  // Ajusta el acceso según la estructura real:
  let collections = res.data.collections;
  if (!collections && Array.isArray(res.data)) {
    collections = res.data;
  }
  if (!collections) {
    throw new Error('No se pudo obtener la lista de colecciones de ChromaDB');
  }
  const found = collections.find(col => col.name === name);
  return found ? found.id : null;
}

export async function createCollection(name) {
  const res = await axios.post(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`,
    { name }
  );
  return res.data.id;
}

export async function addToCollection(collectionId, ids, embeddings, metadatas, documents) {
  return axios.post(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${collectionId}/upsert`,
    {
      ids,
      embeddings,
      metadatas,
      documents
    }
  );
}

export async function queryCollection(collectionId, queryEmbedding, n = 3) {
  const res = await axios.post(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${collectionId}/query`,
    {
      query_embeddings: [queryEmbedding],
      n_results: n
    }
  );
  return res.data;
}


