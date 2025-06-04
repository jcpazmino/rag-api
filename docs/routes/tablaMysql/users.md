# Tabla: users

Esta tabla almacena la información de los usuarios del sistema, incluyendo sus datos personales, credenciales y preferencias.

---

## 📄 Estructura de la tabla

```sql
CREATE TABLE users (
    user_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- UUID como identificador único
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),       -- Almacenado de forma segura con hash
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    preferences JSON,                 -- Preferencias generales del usuario en formato JSON
    UNIQUE INDEX idx_username (username),
    INDEX idx_user_status (status)
);
```

---

## 🧾 Descripción de los campos

| Campo          | Tipo         | Descripción                                                                 |
|----------------|--------------|-----------------------------------------------------------------------------|
| `user_id`      | bigint       | Identificador único del usuario (UUID).                                     |
| `username`     | VARCHAR(100) | Nombre de usuario único.                                                    |
| `email`        | VARCHAR(255) | Correo electrónico único del usuario.                                       |
| `password_hash`| VARCHAR(255) | Hash de la contraseña del usuario.                                          |
| `first_name`   | VARCHAR(100) | Nombre del usuario.                                                         |
| `last_name`    | VARCHAR(100) | Apellido del usuario.                                                       |
| `phone`        | VARCHAR(50)  | Número de teléfono del usuario.                                             |
| `created_at`   | TIMESTAMP    | Fecha y hora de creación del registro.                                      |
| `last_login`   | TIMESTAMP    | Fecha y hora del último inicio de sesión.                                   |
| `status`       | ENUM         | Estado del usuario ('active', 'inactive', 'banned').                        |
| `preferences`  | JSON         | Preferencias del usuario almacenadas en formato JSON.                       |

---

## 🔑 Índices

- **PRIMARY KEY** en `user_id`
- **UNIQUE INDEX** en `username` (idx_username)
- **INDEX** en `status` (idx_user_status)

---

## 🔄 Restricciones

- `username` no puede ser NULL
- `email` debe ser único
- `username` debe ser único
- `status` por defecto es 'active'

---

## 📝 Notas adicionales

- La contraseña se almacena como hash por seguridad
- El campo `preferences` permite almacenar configuraciones personalizadas del usuario
- El campo `last_login` puede ser NULL si el usuario nunca ha iniciado sesión
- El estado del usuario puede ser 'active', 'inactive' o 'banned'
