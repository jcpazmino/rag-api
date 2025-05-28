import { pool } from '../mysqlService.js';

// Crear un chunk
export async function addChunk(chunk) {
  const [result] = await pool.query(
    `INSERT INTO document_chunks (document_id, chunk_index, content, page_number, tokens, embedding_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [chunk.document_id, chunk.chunk_index, chunk.content, chunk.page_number, chunk.tokens, chunk.embedding_id]
  );
  return { id: result.insertId, ...chunk };
}

// Listar todos los chunks
export async function getAllChunks() {
  const [rows] = await pool.query('SELECT * FROM document_chunks');
  return rows;
}

// Listar chunks por documento
export async function getChunksByDocument(document_id) {
  const [rows] = await pool.query('SELECT * FROM document_chunks WHERE document_id = ?', [document_id]);
  return rows;
}

// Obtener chunk por ID
export async function getChunkById(id) {
  const [rows] = await pool.query('SELECT * FROM document_chunks WHERE id = ?', [id]);
  return rows[0];
}

// Modificar chunk
export async function updateChunk(id, chunk) {
  await pool.query(
    `UPDATE document_chunks SET chunk_index=?, content=?, page_number=?, tokens=?, embedding_id=? WHERE id=?`,
    [chunk.chunk_index, chunk.content, chunk.page_number, chunk.tokens, chunk.embedding_id, id]
  );
  return { id, ...chunk };
}

// Borrar chunk
export async function deleteChunk(id) {
  await pool.query('DELETE FROM document_chunks WHERE id = ?', [id]);
  return { id };
}