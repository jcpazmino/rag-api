import { pool } from '../mysqlService.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Agregar un usuario
export async function addUser(user) {
  try {
    // Generar UUID para el user_id
    const user_id = crypto.randomUUID();
    
    // Hashear la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(user.password, saltRounds);

    const [result] = await pool.query(
      `INSERT INTO users (
        user_id, username, email, password_hash, 
        first_name, last_name, phone, status, preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        user.username,
        user.email,
        password_hash,
        user.first_name,
        user.last_name,
        user.phone,
        user.status || 'active',
        JSON.stringify(user.preferences || {})
      ]
    );

    // No devolvemos el password_hash en la respuesta
    const { password_hash: _, ...userWithoutHash } = user;
    return { user_id, ...userWithoutHash };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El nombre de usuario o email ya existe');
    }
    throw error;
  }
}

// Obtener todos los usuarios
export async function getAllUsers(pageSize = 100) {
  const [rows] = await pool.query(
    'SELECT user_id, username, email, first_name, last_name, phone, created_at, last_login, status, preferences FROM users LIMIT ?',
    [pageSize]
  );
  return rows;
}

// Obtener usuario por ID
export async function getUserById(user_id) {
  const [rows] = await pool.query(
    'SELECT user_id, username, email, first_name, last_name, phone, created_at, last_login, status, preferences FROM users WHERE user_id = ?',
    [user_id]
  );
  return rows[0];
}

// Obtener usuario por username
export async function getUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT user_id, username, email, first_name, last_name, phone, created_at, last_login, status, preferences FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

// Obtener usuario por email
export async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT user_id, username, email, first_name, last_name, phone, created_at, last_login, status, preferences FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

// Actualizar usuario
export async function updateUser(user_id, user) {
  try {
    const updateFields = [];
    const values = [];

    // Construir dinámicamente la consulta basada en los campos proporcionados
    if (user.username) {
      updateFields.push('username = ?');
      values.push(user.username);
    }
    if (user.email) {
      updateFields.push('email = ?');
      values.push(user.email);
    }
    if (user.password) {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(user.password, saltRounds);
      updateFields.push('password_hash = ?');
      values.push(password_hash);
    }
    if (user.first_name) {
      updateFields.push('first_name = ?');
      values.push(user.first_name);
    }
    if (user.last_name) {
      updateFields.push('last_name = ?');
      values.push(user.last_name);
    }
    if (user.phone) {
      updateFields.push('phone = ?');
      values.push(user.phone);
    }
    if (user.status) {
      updateFields.push('status = ?');
      values.push(user.status);
    }
    if (user.preferences) {
      updateFields.push('preferences = ?');
      values.push(JSON.stringify(user.preferences));
    }

    if (updateFields.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    values.push(user_id);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
    await pool.query(query, values);
    return { user_id, ...user };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El nombre de usuario o email ya existe');
    }
    throw error;
  }
}

// Actualizar último login
export async function updateLastLogin(user_id) {
  await pool.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
    [user_id]
  );
  return { user_id, last_login: new Date() };
}

// Cambiar estado del usuario
export async function updateUserStatus(user_id, status) {
  if (!['active', 'inactive', 'banned'].includes(status)) {
    throw new Error('Estado de usuario inválido');
  }

  await pool.query(
    'UPDATE users SET status = ? WHERE user_id = ?',
    [status, user_id]
  );
  return { user_id, status };
}

// Eliminar usuario (marcar como inactivo)
export async function deleteUser(user_id) {
  await pool.query(
    'UPDATE users SET status = ? WHERE user_id = ?',
    ['inactive', user_id]
  );
  return { user_id };
}

// Verificar credenciales
export async function verifyCredentials(username, password) {
  const [rows] = await pool.query(
    'SELECT user_id, username, password_hash, status FROM users WHERE username = ?',
    [username]
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  // Actualizar último login
  await updateLastLogin(user.user_id);

  return {
    user_id: user.user_id,
    username: user.username,
    status: user.status
  };
}
