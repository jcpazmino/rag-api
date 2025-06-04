import { pool } from '../mysqlService.js';

// Crear un chunk
export async function addChunk(chunk) {
  try {
    // Asegurarse de que embedding_ids sea un array válido
    const embeddingIds = Array.isArray(chunk.embedding_ids) 
      ? chunk.embedding_ids 
      : JSON.parse(chunk.embedding_ids);

    // Convertir el array a una cadena JSON válida
    const embeddingIdsJson = JSON.stringify(embeddingIds);

    const [result] = await pool.query(
      `INSERT INTO document_Embeddings (collection_id, document_id, embedding_ids)
       VALUES (?, ?, ?)`,
      [chunk.collection_id, chunk.document_id, embeddingIdsJson]
    );
    return { id: result.insertId, ...chunk };
  } catch (error) {
    console.error('Error en addChunk:', error);
    throw new Error(`Error al crear chunk: ${error.message}`);
  }
}

// Listar todos los chunks
export async function getAllChunks() {
  const [rows] = await pool.query('SELECT * FROM document_Embeddings');
  return rows;
}

// Listar chunks por documento
export async function getChunksByDocument(document_id) {
  const [rows] = await pool.query(
    'SELECT * FROM document_Embeddings WHERE document_id = ?', 
    [document_id]
  );
  return rows;
}

// Obtener chunk por ID
export async function getChunkById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM document_Embeddings WHERE id = ?', 
    [id]
  );
  return rows[0];
}

// Modificar chunk
export async function updateChunk(id, chunk) {
  await pool.query(
    `UPDATE document_Embeddings 
     SET collection_id = ?, 
         document_id = ?, 
         embedding_ids = ?
     WHERE id = ?`,
    [chunk.collection_id, chunk.document_id, chunk.embedding_ids, id]
  );
  return { id, ...chunk };
}

// Borrar chunk
export async function deleteChunk(id) {
  await pool.query('DELETE FROM document_Embeddings WHERE id = ?', [id]);
  return { id };
}