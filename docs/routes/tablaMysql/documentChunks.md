# Tabla de Fragmentos de Documentos (Document Chunks)

## Tabla de Contenido
- [Descripción General](#descripción-general)
- [Sentencia SQL de Creación](#sentencia-sql-de-creación)
- [Estructura de la Tabla](#estructura-de-la-tabla)
- [Relaciones](#relaciones)
- [API Endpoints](#api-endpoints)
  - [Crear Fragmento](#crear-fragmento)
  - [Listar Fragmentos](#listar-fragmentos)
  - [Listar Fragmentos por Documento](#listar-fragmentos-por-documento)
  - [Obtener Fragmento por ID](#obtener-fragmento-por-id)
  - [Actualizar Fragmento](#actualizar-fragmento)
  - [Eliminar Fragmento](#eliminar-fragmento)
- [Respuestas de Error](#respuestas-de-error)
- [Ejemplos de Respuesta](#ejemplos-de-respuesta)

## Descripción General
La tabla `document_Embeddings` almacena los fragmentos (chunks) de texto extraídos de documentos para su procesamiento semántico con embeddings, como parte de un sistema RAG (Retrieval-Augmented Generation). Esta tabla es fundamental para el proceso de filtrado y búsqueda semántica de documentos.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Sentencia SQL de Creación
```sql
CREATE TABLE document_Embeddings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  collection_id varchar(255) NOT NULL,
  document_id BIGINT NOT NULL,
  embedding_ids JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
```

[Volver a la tabla de contenido](#tabla-de-contenido)

## Estructura de la Tabla

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Identificador único del fragmento |
| collection_id | varchar(255) | NOT NULL | ID devuelto por el embedding |
| document_id | BIGINT | NOT NULL, FOREIGN KEY | ID del documento original |
| embedding_ids | JSON | NULL | IDs vectores correspondientes en la base vectorial |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de creación del registro |

[Volver a la tabla de contenido](#tabla-de-contenido)

## Relaciones
- **document_id**: Clave foránea que se conecta con la tabla `documents`
- Cada documento puede tener múltiples fragmentos (relación 1 a N)
- Cada fragmento corresponde a un elemento del vector almacenado en `embedding_ids`

[Volver a la tabla de contenido](#tabla-de-contenido)

## API Endpoints

### Crear Fragmento
```http
POST /document-chunks
```
Crea un nuevo fragmento de documento.

**Cuerpo de la solicitud:**
```json
{
  "collection_id": "nombre-coleccion",
  "document_id": 1,
  "embedding_ids": ["id1", "id2", "id3"]
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Listar Fragmentos
```http
GET /document-chunks
```
Retorna todos los fragmentos de documentos.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Listar Fragmentos por Documento
```http
GET /document-chunks/document/:document_id
```
Retorna todos los fragmentos asociados a un documento específico.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Obtener Fragmento por ID
```http
GET /document-chunks/:id
```
Retorna un fragmento específico por su ID.

[Volver a la tabla de contenido](#tabla-de-contenido)

### Actualizar Fragmento
```http
PUT /document-chunks/:id
```
Actualiza un fragmento existente.

**Cuerpo de la solicitud:**
```json
{
  "collection_id": "nueva-coleccion",
  "document_id": 1,
  "embedding_ids": ["id4", "id5", "id6"]
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)

### Eliminar Fragmento
```http
DELETE /document-chunks/:id
```
Elimina un fragmento específico.

[Volver a la tabla de contenido](#tabla-de-contenido)

## Respuestas de Error
Todas las rutas pueden devolver los siguientes errores:

- `400 Bad Request`: Cuando el formato de la solicitud es inválido
- `404 Not Found`: Cuando no se encuentra el fragmento solicitado
- `500 Internal Server Error`: Cuando ocurre un error en el servidor

[Volver a la tabla de contenido](#tabla-de-contenido)

## Ejemplos de Respuesta

### Respuesta Exitosa (GET)
```json
{
  "id": 1,
  "collection_id": "nombre-coleccion",
  "document_id": 1,
  "embedding_ids": ["id1", "id2", "id3"],
  "created_at": "2024-03-20T10:00:00Z"
}
```

### Respuesta de Error
```json
{
  "error": "Error al crear fragmento."
}
```

[Volver a la tabla de contenido](#tabla-de-contenido)



