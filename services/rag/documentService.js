import { pool } from '../mysqlService.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Agregar un documento
export async function addDocument(document) {
  const now = new Date();
  const [result] = await pool.query(
    `INSERT INTO documents 
      (title, file_name, description, author, category, tags, source, language, upload_date, uploaded_by, processed, total_chunks, total_tokens, embedding_model, version, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      document.title,
      document.file_name,
      document.description,
      document.author,
      document.category,
      JSON.stringify(document.tags ?? []),
      document.source ?? 'data/uploads/pdf/' + document.file_name,
      document.language,
      now,
      document.uploaded_by ?? 'system', // Usuario por defecto si no se proporciona
      document.processed ?? true,
      document.total_chunks ?? 0,
      document.total_tokens ?? 0,
      document.embedding_model ?? 'text-embedding-ada-002',
      document.version,
      'procesado' // status fijo
    ]
  );
  return { id: result.insertId, ...document, upload_date: now, status: 'procesado' };
}

// Consultar todos los documentos con status 'procesado'
export async function getAllDocuments(pageSize = 100) {
  const [rows] = await pool.query(
    'SELECT * FROM documents WHERE status = ? ORDER BY title LIMIT ?',
    ['procesado', pageSize]
  );
  return rows;
}

// Consultar un documento por ID
export async function getDocumentById(id) {
  const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
  return rows[0];
}

// Consultar un documento por título (búsqueda parcial, case-insensitive)
export async function getDocumentByTitle(title) {
  const [rows] = await pool.query('SELECT * FROM documents WHERE title = ?', [title] );
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows[0];
}

// Modificar un documento
export async function updateDocument(id, document) {
  const now = new Date();
  await pool.query(
    `UPDATE documents SET 
      title = ?, 
      file_name = ?, 
      description = ?, 
      author = ?, 
      category = ?, 
      tags = ?, 
      source = ?, 
      language = ?, 
      upload_date = ?, 
      uploaded_by = ?, 
      processed = ?, 
      total_chunks = ?, 
      total_tokens = ?, 
      embedding_model = ?, 
      version = ?, 
      status = ?
     WHERE id = ?`,
    [
      document.title,
      document.file_name,
      document.description,
      document.author,
      document.category,
      JSON.stringify(document.tags ?? []),
      document.source ?? 'data/uploads/pdf/' + document.file_name,
      document.language,
      now,
      document.uploaded_by ?? 'system',
      document.processed ?? true,
      document.total_chunks ?? 0,
      document.total_tokens ?? 0,
      document.embedding_model ?? 'text-embedding-ada-002',
      document.version,
      'procesado', // status fijo
      id
    ]
  );
  return { id, ...document, upload_date: now, status: 'procesado' };
}

// Borrar un documento (marcar como inactivo)
export async function deleteDocument(id) {
  await pool.query('UPDATE documents SET status = ? WHERE id = ?', ['inactivo', id]);
  return { id };
}

/**
 * Envía un archivo PDF almacenado en data/uploads/pdf
 * @param {Object} res - response de Express
 * @param {string} fileName - nombre del archivo a enviar
 */
export function enviaFile(res, fileName) {
  const filePath = path.join('data', 'uploads', 'pdf', fileName);

  // Verifica si el archivo existe
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Archivo no encontrado.' });
    return;
  }

  // Configura los encabezados para descarga de PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  // Envía el archivo
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}