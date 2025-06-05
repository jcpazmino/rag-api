import { pool } from '../mysqlService.js';

// Agregar una categoría
export async function addCategory(category) {
  const [result] = await pool.query(
    `INSERT INTO document_categories 
      (name, slug, description, parent_id, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      category.name,
      category.slug,
      category.description,
      category.parent_id,
      category.status ?? 'activa'
    ]
  );
  
  return result;
}

// Consultar todas las categorías
export async function getAllCategories() {
  const [rows] = await pool.query(
    'SELECT * FROM document_categories ORDER BY name'
  );
  return rows;
}

// Consultar una categoría por ID
export async function getCategoryById(id) {
  const [rows] = await pool.query('SELECT * FROM document_categories WHERE id = ?', [id]);
  return rows[0];
}

// Consultar una categoría por slug
export async function getCategoryBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM document_categories WHERE slug = ?', [slug]);
  return rows[0];
}

// Modificar una categoría
export async function updateCategory(id, category) {
  await pool.query(
    `UPDATE document_categories SET 
      name = ?, 
      slug = ?, 
      description = ?, 
      parent_id = ?, 
      status = ?
     WHERE id = ?`,
    [
      category.name,
      category.slug,
      category.description,
      category.parent_id,
      category.status,
      id
    ]
  );
  return { id, ...category };
}

// Borrar una categoría (marcar como inactiva)
export async function deleteCategory(id) {
  await pool.query('UPDATE document_categories SET status = ? WHERE id = ?', ['inactiva', id]);
  return { id };
}

// Obtener categorías por estado
export async function getCategoriesByStatus(status) {
  const [rows] = await pool.query(
    'SELECT * FROM document_categories WHERE status = ? ORDER BY name',
    [status]
  );
  return rows;
}

// Obtener categorías padre
export async function getParentCategories() {
  const [rows] = await pool.query(
    'SELECT * FROM document_categories WHERE parent_id IS NULL ORDER BY name'
  );
  return rows;
}

// Obtener subcategorías de una categoría específica
export async function getSubcategories(parentId) {
  const [rows] = await pool.query(
    'SELECT * FROM document_categories WHERE parent_id = ? ORDER BY name',
    [parentId]
  );
  return rows;
} 