# Tabla: document_chunks

Esta tabla almacena los **fragmentos (chunks)** de texto extraídos de documentos para su procesamiento semántico con embeddings, como parte de un sistema RAG (Retrieval-Augmented Generation).

---

## 📄 Estructura de la tabla

```sql
CREATE TABLE document_chunks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  document_id BIGINT NOT NULL,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  page_number INT DEFAULT NULL,
  tokens INT NOT NULL,
  embedding_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
```

---

## 🧾 Descripción de los campos

| Campo         | Tipo        | Descripción                                                                 |
|---------------|-------------|-----------------------------------------------------------------------------|
| `id`          | BIGINT      | Identificador único del fragmento.                                          |
| `document_id` | BIGINT      | ID del documento original (relación con la tabla `documents`).              |
| `chunk_index` | INT         | Índice que indica el orden del fragmento dentro del documento.              |
| `content`     | TEXT        | Contenido textual del fragmento (chunk).                                    |
| `page_number` | INT         | Página del documento de donde se extrajo el fragmento (si se conoce).       |
| `tokens`      | INT         | Número de tokens estimados en el fragmento, útil para control y costos.     |
| `embedding_id`| VARCHAR(255)| ID del vector correspondiente en la base vectorial (Chroma, Pinecone, etc.).|
| `created_at`  | DATETIME    | Fecha y hora de creación del registro.                                      |
| `updated_at`  | DATETIME    | Fecha y hora de última modificación del registro.                           |

---

## 🔗 Relaciones

- **document_id** es una clave foránea que se conecta con la tabla `documents`.
- Cada documento puede tener múltiples fragmentos, representando una relación 1 a N.

---

## 🧠 Uso en el sistema RAG

- Permite **reconstruir el contexto** del documento original por orden de fragmentos.
- Facilita **la búsqueda semántica**, ya que cada fragmento puede ser vinculado a su vector en una base de datos vectorial.
- Proporciona **trazabilidad** al identificar la página y orden original del contenido consultado.

