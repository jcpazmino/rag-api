# Tabla de Usuarios

## Tabla de Contenido
- [Descripción General](#descripción-general)
- [Sentencia SQL de Creación](#sentencia-sql-de-creación)
- [Estructura de la Tabla](#estructura-de-la-tabla)
- [Índices](#índices)
- [Restricciones](#restricciones)
- [Notas Adicionales](#notas-adicionales)
- [API Endpoints](#api-endpoints)
  - [Iniciar Sesión](#iniciar-sesión)
  - [Crear Usuario](#crear-usuario)
  - [Listar Usuarios](#listar-usuarios)
  - [Obtener Usuario por ID](#obtener-usuario-por-id)
  - [Obtener Usuario por Nombre de Usuario](#obtener-usuario-por-nombre-de-usuario)
  - [Obtener Usuario por Email](#obtener-usuario-por-email)
  - [Actualizar Usuario](#actualizar-usuario)
  - [Actualizar Estado de Usuario](#actualizar-estado-de-usuario)
  - [Eliminar Usuario](#eliminar-usuario)
- [Respuestas de Error](#respuestas-de-error)
- [Ejemplos de Respuesta](#ejemplos-de-respuesta)

## Descripción General
Esta tabla almacena la información de los usuarios del sistema, incluyendo sus datos personales, credenciales y preferencias.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Sentencia SQL de Creación
```sql
CREATE TABLE users (
    user_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    preferences JSON,
    UNIQUE INDEX idx_username (username),
    INDEX idx_user_status (status)
);
```

[Volver a la tabla de contenido](#tabla-de-contenido)

## Estructura de la Tabla

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| user_id | bigint | PRIMARY KEY, AUTO_INCREMENT | Identificador único del usuario |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Nombre de usuario único |
| email | VARCHAR(255) | UNIQUE | Correo electrónico único |
| password_hash | VARCHAR(255) | NULL | Hash de la contraseña |
| first_name | VARCHAR(100) | NULL | Nombre del usuario |
| last_name | VARCHAR(100) | NULL | Apellido del usuario |
| phone | VARCHAR(50) | NULL | Número de teléfono |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| last_login | TIMESTAMP | NULL | Último inicio de sesión |
| status | ENUM | DEFAULT 'active' | Estado del usuario |
| preferences | JSON | NULL | Preferencias del usuario |

[Volver a la tabla de contenido](#tabla-de-contenido)

## Índices
- **PRIMARY KEY** en `user_id`
- **UNIQUE INDEX** en `username` (idx_username)
- **INDEX** en `status` (idx_user_status)

[Volver a la tabla de contenido](#tabla-de-contenido)

## Restricciones
- `username` no puede ser NULL
- `email` debe ser único
- `username` debe ser único
- `status` por defecto es 'active'

[Volver a la tabla de contenido](#tabla-de-contenido)

## Notas Adicionales
- La contraseña se almacena como hash por seguridad
- El campo `preferences` permite almacenar configuraciones personalizadas
- El campo `last_login` puede ser NULL si el usuario nunca ha iniciado sesión
- El estado del usuario puede ser 'active', 'inactive' o 'banned'

[Volver a la tabla de contenido](#tabla-de-contenido)

## API Endpoints

### Iniciar Sesión
```http
POST /login
```
Verifica las credenciales del usuario.

**Cuerpo de la solicitud:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Crear Usuario
```http
POST /users
```
Crea un nuevo usuario en el sistema.

**Cuerpo de la solicitud:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña",
  "first_name": "Nombre",
  "last_name": "Apellido",
  "phone": "123456789",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Listar Usuarios
```http
GET /users
```
Retorna todos los usuarios activos.

**Parámetros de consulta:**
- `pageSize`: Número de usuarios por página (default: 100)

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Usuario por ID
```http
GET /users/:id
```
Retorna un usuario específico por su ID.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Usuario por Nombre de Usuario
```http
GET /users/username/:username
```
Retorna un usuario específico por su nombre de usuario.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Usuario por Email
```http
GET /users/email/:email
```
Retorna un usuario específico por su email.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Actualizar Usuario
```http
PUT /users/:id
```
Actualiza la información de un usuario existente.

**Cuerpo de la solicitud:**
```json
{
  "username": "nuevo_username",
  "email": "nuevo@email.com",
  "first_name": "Nuevo Nombre",
  "last_name": "Nuevo Apellido",
  "phone": "987654321",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Actualizar Estado de Usuario
```http
PATCH /users/:id/status
```
Actualiza el estado de un usuario.

**Cuerpo de la solicitud:**
```json
{
  "status": "inactive"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Eliminar Usuario
```http
DELETE /users/:id
```
Marca un usuario como inactivo.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Respuestas de Error
Todas las rutas pueden devolver los siguientes errores:

- `400 Bad Request`: Cuando faltan campos requeridos o son inválidos
- `401 Unauthorized`: Cuando las credenciales son inválidas
- `403 Forbidden`: Cuando el usuario está inactivo o bloqueado
- `404 Not Found`: Cuando no se encuentra el usuario
- `409 Conflict`: Cuando el username o email ya existe
- `500 Internal Server Error`: Cuando ocurre un error en el servidor

[Volver a la tabla de contenido](#tabla-de-contenido)

## Ejemplos de Respuesta

### Respuesta Exitosa (GET)
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "first_name": "Nombre",
  "last_name": "Apellido",
  "phone": "123456789",
  "created_at": "2024-03-20T10:00:00Z",
  "last_login": "2024-03-20T15:30:00Z",
  "status": "active",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### Respuesta de Error
```json
{
  "error": "Credenciales inválidas"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)
