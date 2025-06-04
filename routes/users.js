import express from 'express';
import { 
  addUser, 
  getAllUsers, 
  getUserById, 
  getUserByUsername,
  getUserByEmail,
  updateUser,
  updateLastLogin,
  updateUserStatus,
  deleteUser,
  verifyCredentials
} from '../services/rag/userService.js';

const router = express.Router();

// Middleware para validar campos requeridos
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }
    next();
  };
};

// POST /login - Verificar credenciales (ruta directa)
router.post('/login', validateRequiredFields(['username', 'password']), async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await verifyCredentials(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Usuario inactivo o bloqueado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar credenciales' });
  }
});

// POST /users - Crear nuevo usuario
router.post('/', validateRequiredFields(['username', 'email', 'password']), async (req, res) => {
  try {
    const user = await addUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'El nombre de usuario o email ya existe') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }
});

// GET /users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 100;
    const users = await getAllUsers(pageSize);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// GET /users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// GET /users/username/:username - Obtener usuario por nombre de usuario
router.get('/username/:username', async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// GET /users/email/:email - Obtener usuario por email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// PUT /users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'El nombre de usuario o email ya existe') {
      res.status(409).json({ error: error.message });
    } else if (error.message === 'No se proporcionaron campos para actualizar') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  }
});

// PATCH /users/:id/status - Actualizar estado del usuario
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'El estado es requerido' });
    }
    const user = await updateUserStatus(req.params.id, status);
    res.json(user);
  } catch (error) {
    if (error.message === 'Estado de usuario inválido') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
    }
  }
});

// DELETE /users/:id - Eliminar usuario (marcar como inactivo)
router.delete('/:id', async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

export default router;
