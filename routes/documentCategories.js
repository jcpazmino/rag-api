import express from 'express';
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoriesByStatus,
  getParentCategories,
  getSubcategories
} from '../services/rag/documentCategoryService.js';

const router = express.Router();

// Crear categoría
router.post('/', async (req, res) => {
  try {
    const category = await addCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría.' });
  }
});

// Obtener categoría por slug
router.get('/by-slug', async (req, res) => {
  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: 'El parámetro slug es requerido.' });
  }
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categoría por slug.' });
  }
});

// Listar todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar categorías.' });
  }
});

// Obtener categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categoría.' });
  }
});

// Modificar categoría
router.put('/:id', async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría.' });
  }
});

// Borrar categoría
router.delete('/:id', async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría.' });
  }
});

// Obtener categorías por estado
router.get('/status/:status', async (req, res) => {
  try {
    const categories = await getCategoriesByStatus(req.params.status);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías por estado.' });
  }
});

// Obtener categorías padre
router.get('/parents/all', async (req, res) => {
  try {
    const categories = await getParentCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías padre.' });
  }
});

// Obtener subcategorías
router.get('/subcategories/:parentId', async (req, res) => {
  try {
    const categories = await getSubcategories(req.params.parentId);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener subcategorías.' });
  }
});

export default router; 