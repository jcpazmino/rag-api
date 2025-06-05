# Tabla de Documentos

## Tabla de Contenido
- [Descripción General](#descripción-general)
- [Sentencia SQL de Creación](#sentencia-sql-de-creación)
- [Estructura de la Tabla](#estructura-de-la-tabla)
- [Uso en el Sistema RAG](#uso-en-el-sistema-rag)
- [API Endpoints](#api-endpoints)
  - [Crear Documento](#crear-documento)
  - [Listar Documentos](#listar-documentos)
  - [Obtener Documento por ID](#obtener-documento-por-id)
  - [Obtener Documento por Título](#obtener-documento-por-título)
  - [Actualizar Documento](#actualizar-documento)
  - [Eliminar Documento](#eliminar-documento)
  - [Descargar Documento](#descargar-documento)
- [Respuestas de Error](#respuestas-de-error)
- [Ejemplos de Respuesta](#ejemplos-de-respuesta)

## Descripción General
La tabla `documents` almacena los metadatos asociados a cada documento original que será procesado en un sistema RAG (Retrieval-Augmented Generation). Esta tabla permite gestionar, auditar y consultar información relevante sobre los documentos fuente, su estado y características.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Sentencia SQL de Creación
```sql
CREATE TABLE documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  tags JSON,
  source TEXT,
  language VARCHAR(50) DEFAULT 'es',
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(100),
  processed BOOLEAN DEFAULT FALSE,
  total_chunks INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  embedding_model VARCHAR(100),
  version VARCHAR(50),
  status ENUM('pendiente', 'procesado', 'error', 'inactivo') DEFAULT 'pendiente'
);
```

[Volver a la tabla de contenido](#tabla-de-contenido)

## Estructura de la Tabla

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Identificador único del documento |
| title | VARCHAR(255) | NOT NULL | Título descriptivo del documento |
| file_name | VARCHAR(255) | NOT NULL | Nombre del archivo físico cargado |
| description | TEXT | NULL | Descripción adicional del contenido |
| author | VARCHAR(255) | NULL | Autor o responsable del contenido |
| category | VARCHAR(100) | NULL | Categoría temática o tipo de documento |
| tags | JSON | NULL | Lista de palabras clave asociadas |
| source | TEXT | NULL | Ruta o URL de origen del archivo |
| language | VARCHAR(50) | DEFAULT 'es' | Idioma principal del documento |
| upload_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de carga |
| uploaded_by | VARCHAR(100) | NULL | Usuario o sistema que subió el documento |
| processed | BOOLEAN | DEFAULT FALSE | Indica si el documento fue procesado |
| total_chunks | INT | DEFAULT 0 | Cantidad de fragmentos generados |
| total_tokens | INT | DEFAULT 0 | Total estimado de tokens |
| embedding_model | VARCHAR(100) | NULL | Modelo usado para embeddings |
| version | VARCHAR(50) | NULL | Versión del documento |
| status | ENUM | DEFAULT 'pendiente' | Estado del procesamiento |

[Volver a la tabla de contenido](#tabla-de-contenido)

## Uso en el Sistema RAG
- Proporciona una vista general de los documentos cargados en el sistema
- Permite hacer seguimiento al estado de procesamiento y versión
- Facilita filtros por categoría, autor, idioma o fecha
- Integra con la tabla `document_chunks` a través del campo `id`

[Volver a la tabla de contenido](#tabla-de-contenido)

## API Endpoints

### Crear Documento
```http
POST /documents
```
Crea un nuevo documento en el sistema.

**Cuerpo de la solicitud:**
```json
{
  "title": "Título del Documento",
  "file_name": "documento.pdf",
  "description": "Descripción del documento",
  "author": "Autor del Documento",
  "category": "Categoría",
  "tags": ["tag1", "tag2"],
  "source": "data/uploads/pdf/documento.pdf",
  "language": "es",
  "uploaded_by": "usuario",
  "version": "1.0"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Listar Documentos
```http
GET /documents
```
Retorna todos los documentos procesados, ordenados por título.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Documento por ID
```http
GET /documents/:id
```
Retorna un documento específico por su ID.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Documento por Título
```http
GET /documents/by-title?title=Título del Documento
```
Retorna un documento específico por su título.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Actualizar Documento
```http
PUT /documents/:id
```
Actualiza un documento existente.

**Cuerpo de la solicitud:**
```json
{
  "title": "Nuevo Título",
  "file_name": "nuevo-documento.pdf",
  "description": "Nueva descripción",
  "author": "Nuevo Autor",
  "category": "Nueva Categoría",
  "tags": ["nuevo-tag1", "nuevo-tag2"],
  "source": "data/uploads/pdf/nuevo-documento.pdf",
  "language": "es",
  "version": "2.0"
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Eliminar Documento
```http
DELETE /documents/:id
```
Marca un documento como inactivo.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Descargar Documento
```http
GET /documents/download?file_name=documento.pdf
```
Descarga el archivo PDF del documento.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Respuestas de Error
Todas las rutas pueden devolver los siguientes errores:

- `400 Bad Request`: Cuando faltan parámetros requeridos
- `404 Not Found`: Cuando no se encuentra el documento solicitado
- `500 Internal Server Error`: Cuando ocurre un error en el servidor

[Volver a la tabla de contenido](#tabla-de-contenido)

## Ejemplos de Respuesta

### Respuesta Exitosa (GET)
```json
{
  "id": 1,
  "title": "Título del Documento",
  "file_name": "documento.pdf",
  "description": "Descripción del documento",
  "author": "Autor del Documento",
  "category": "Categoría",
  "tags": ["tag1", "tag2"],
  "source": "data/uploads/pdf/documento.pdf",
  "language": "es",
  "upload_date": "2024-03-20T10:00:00Z",
  "uploaded_by": "usuario",
  "processed": true,
  "total_chunks": 10,
  "total_tokens": 1000,
  "embedding_model": "text-embedding-ada-002",
  "version": "1.0",
  "status": "procesado"
}
```

### Respuesta de Error
```json
{
  "error": "Error al crear documento."
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

