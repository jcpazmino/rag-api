# Tabla: document_Embeddings

Esta tabla almacena los **fragmentos (chunks)** de texto extraídos de documentos para su procesamiento semántico con embeddings, como parte de un sistema RAG (Retrieval-Augmented Generation). Nos sirve para el proceso de filtrado

---

## 📄 Estructura de la tabla

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

---

## 🧾 Descripción de los campos

| Campo         | Tipo        | Descripción                                                                 |
|---------------|-------------|-----------------------------------------------------------------------------|
| `id`          | BIGINT      | Identificador único del fragmento.                                          |
| `collection_id` | varchar   | ID devuelto por el ambeddding,                                              |
| `document_id` | BIGINT      | ID del documento original (relación con la tabla `documents`).              |
| `embedding_ids`| JSON       | IDs vectores correspondientes en la base vectorial (Chroma, Pinecone, etc.).|
| `created_at`  | DATETIME    | Fecha y hora de creación del registro.                                      |

---

## 🔗 Relaciones

- **document_id** es una clave foránea que se conecta con la tabla `documents`.
- Cada documento puede tener múltiples fragmentos, representando una relación 1 a N. a cada fragmento corresponde un 
  elemento del vector almacenado en embedding_ids



