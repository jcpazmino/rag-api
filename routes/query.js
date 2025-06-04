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
const experticia = 'Pedagogo, especialista en educación y formación';
const publicoRespuesta = 'Profesores, Directores y asistentes de dirección';
const promptSystem = `
Eres un asistente con experiencia especializada en ${experticia}. 
Tu tarea es generar respuestas claras, útiles y bien fundamentadas, usando únicamente la información proporcionada por los documentos que te serán entregados.

Tu respuesta debe estar orientada al siguiente público: ${publicoRespuesta}.
Adapta el lenguaje, el nivel de detalle y el tono para que sea apropiado para ese público.

No inventes información fuera de los documentos. Si la respuesta no está en los documentos, acláralo con transparencia.
Enfócate en ser preciso, relevante y útil para quien hará uso de tu explicación.
`;


router.post('/', async (req, res) => {
  const { pregunta, n } = req.body;
  if (!pregunta) return res.status(400).json({ error: 'Falta la pregunta' });

  try {
    // 1. Obtener el ID de la colección
    const collectionId = await getCollectionIdByName(COLLECTION_NAME);
    if (!collectionId) return res.status(404).json({ error: 'Colección no encontrada' });

    // 2. Generar el embedding de la pregunta
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const queryEmbedding = await getQueryEmbedding(pregunta, openai);

    // 3. Realizar la consulta en ChromaDB
    const resultados = await queryCollection(collectionId, queryEmbedding, n || 3);

    // 4. Formatear la respuesta
    const respuestaFormateada = {
      pregunta: pregunta,
      resultados: resultados.documents[0].map((texto, index) => ({
        texto: texto,
        score: 1 - resultados.distances[0][index], // Convertir distancia a score (1 - distancia)
        metadata: resultados.metadatas[0][index]
      }))
    };

    //5. pasar la respuesta a el agente de openai, para que nos formatee la respuesta
    const respuestaAgente = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promptSystem },
        { role: "user", content: JSON.stringify(respuestaFormateada) }
      ]
    });
    console.log(respuestaAgente.choices[0].message.content);
    res.json(respuestaAgente.choices[0].message.content);
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
