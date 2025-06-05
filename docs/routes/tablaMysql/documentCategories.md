# Tabla de Categorías de Documentos

## Tabla de Contenido
- [Descripción General](#descripción-general)
- [Sentencia SQL de Creación](#sentencia-sql-de-creación)
- [Estructura de la Tabla](#estructura-de-la-tabla)
- [Relaciones](#relaciones)
- [Índices](#índices)
- [Notas](#notas)
- [API Endpoints](#api-endpoints)
  - [Crear Categoría](#crear-categoría)
  - [Listar Categorías](#listar-categorías)
  - [Obtener Categoría por ID](#obtener-categoría-por-id)
  - [Obtener Categoría por Slug](#obtener-categoría-por-slug)
  - [Actualizar Categoría](#actualizar-categoría)
  - [Eliminar Categoría](#eliminar-categoría)
  - [Obtener Categorías por Estado](#obtener-categorías-por-estado)
  - [Obtener Categorías Padre](#obtener-categorías-padre)
  - [Obtener Subcategorías](#obtener-subcategorías)
- [Respuestas de Error](#respuestas-de-error)
- [Ejemplos de Respuesta](#ejemplos-de-respuesta)

## Descripción General
La tabla `document_categories` está diseñada para almacenar categorías de documentos jerárquicas con soporte para relaciones padre-hijo.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Sentencia SQL de Creación
```sql
CREATE TABLE document_categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id BIGINT DEFAULT NULL,
  status ENUM('activa', 'inactiva') DEFAULT 'activa',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES document_categories(id)
);
```

[Volver a la tabla de contenido](#tabla-de-contenido)

## Estructura de la Tabla

| Nombre de Columna | Tipo de Dato | Restricciones | Descripción |
|------------------|--------------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Identificador único de la categoría |
| name | VARCHAR(100) | NOT NULL | Nombre de la categoría |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | Versión amigable para URL del nombre de la categoría |
| description | TEXT | NULL | Descripción detallada de la categoría |
| parent_id | BIGINT | DEFAULT NULL, FOREIGN KEY | Referencia a la categoría padre (auto-referencial) |
| status | ENUM | DEFAULT 'activa' | Estado de la categoría ('activa' o 'inactiva') |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Marca de tiempo de creación de la categoría |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Marca de tiempo de última actualización de la categoría |

[Volver a la tabla de contenido](#tabla-de-contenido)

## Relaciones
- **Auto-Referencial**: La columna `parent_id` hace referencia a la columna `id` de la misma tabla, permitiendo estructuras jerárquicas de categorías.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Índices
- Clave Primaria: `id`
- Índice Único: `slug`

[Volver a la tabla de contenido](#tabla-de-contenido)

## Notas
- Las categorías pueden organizarse en una estructura jerárquica utilizando el campo `parent_id`
- El campo `status` tiene como valor predeterminado 'activa' y puede ser 'activa' o 'inactiva'
- Las marcas de tiempo se gestionan automáticamente para la creación y actualización

[Volver a la tabla de contenido](#tabla-de-contenido)

## API Endpoints

### Crear Categoría
```http
POST /document-categories
```
Crea una nueva categoría de documentos.

**Cuerpo de la solicitud:**
```json
{
  "name": "Nombre de la categoría",
  "slug": "nombre-de-la-categoria",
  "description": "Descripción de la categoría",
  "parent_id": null,
  "status": "activa"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Listar Categorías
```http
GET /document-categories
```
Retorna todas las categorías ordenadas por nombre.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Categoría por ID
```http
GET /document-categories/:id
```
Retorna una categoría específica por su ID.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Categoría por Slug
```http
GET /document-categories/by-slug?slug=nombre-de-la-categoria
```
Retorna una categoría específica por su slug.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Actualizar Categoría
```http
PUT /document-categories/:id
```
Actualiza una categoría existente.

**Cuerpo de la solicitud:**
```json
{
  "name": "Nuevo nombre",
  "slug": "nuevo-slug",
  "description": "Nueva descripción",
  "parent_id": null,
  "status": "activa"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Eliminar Categoría
```http
DELETE /document-categories/:id
```
Marca una categoría como inactiva.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Categorías por Estado
```http
GET /document-categories/status/:status
```
Retorna todas las categorías con un estado específico ('activa' o 'inactiva').

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Categorías Padre
```http
GET /document-categories/parents/all
```
Retorna todas las categorías que no tienen categoría padre (parent_id es NULL).

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Subcategorías
```http
GET /document-categories/subcategories/:parentId
```
Retorna todas las subcategorías de una categoría padre específica.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Respuestas de Error
Todas las rutas pueden devolver los siguientes errores:

- `400 Bad Request`: Cuando faltan parámetros requeridos
- `404 Not Found`: Cuando no se encuentra la categoría solicitada
- `500 Internal Server Error`: Cuando ocurre un error en el servidor

[Volver a la tabla de contenido](#tabla-de-contenido)

## Ejemplos de Respuesta

### Respuesta Exitosa (GET)
```json
{
  "id": 1,
  "name": "Categoría Principal",
  "slug": "categoria-principal",
  "description": "Descripción de la categoría",
  "parent_id": null,
  "status": "activa",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

### Respuesta de Error
```json
{
  "error": "Error al crear categoría."
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)
