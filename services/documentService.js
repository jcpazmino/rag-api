import { pool } from './mysqlService.js';

// Agregar un documento
export async function addDocument(document) {
  const [result] = await pool.query(
    'INSERT INTO documents (title, content) VALUES (?, ?)',
    [document.title, document.content]
  );
  return { id: result.insertId, ...document };
}

// Consultar todos los documentos
export async function getAllDocuments() {
  const [rows] = await pool.query('SELECT * FROM documents');
  return rows;
}

// Consultar un documento por ID
export async function getDocumentById(id) {
  const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
  return rows[0];
}

// Modificar un documento
export async function updateDocument(id, document) {
  await pool.query(
    'UPDATE documents SET title = ?, content = ? WHERE id = ?',
    [document.title, document.content, id]
  );
  return { id, ...document };
}

// Borrar un documento
export async function deleteDocument(id) {
  await pool.query('DELETE FROM documents WHERE id = ?', [id]);
  return { id };
}