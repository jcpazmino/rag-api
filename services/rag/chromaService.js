import 'dotenv/config'; // <-- Agrega esta línea al inicio

import axios from 'axios';
import OpenAI from 'openai';

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

  return result;
}

export async function getCollectionIdByName(name) {
  const res = await axios.get( `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`);

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
  try {
    const body = {
      query_embeddings: [queryEmbedding],
      n_results: n,
      include: ["documents", "metadatas", "distances"]
    };

    const res = await axios.post(
      `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${collectionId}/query`,
      body
    );

    if (!res.data || !res.data.documents || !res.data.documents[0]) {
      throw new Error('Respuesta inválida de ChromaDB');
    }

    return res.data;
  } catch (error) {
    console.error('Error en queryCollection:', error.response?.data || error.message);
    throw error;
  }
}

export async function listDocumentsInCollection(collectionId) {
  const res = await axios.post(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${collectionId}/get`,
    {
      // Puedes dejar el body vacío para traer todos los documentos
    }
  );
  return res.data;
}

export async function deleteCollection(collectionId) {
  await axios.delete(
    `${BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${collectionId}`
  );
}


