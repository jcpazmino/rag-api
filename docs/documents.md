# Tabla: documents

La tabla `documents` almacena los metadatos asociados a cada documento original que será procesado en un sistema RAG (Retrieval-Augmented Generation). Esta tabla permite gestionar, auditar y consultar información relevante sobre los documentos fuente, su estado y características.

---

## 📄 Estructura de la tabla

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
  status ENUM('pendiente', 'procesado', 'error') DEFAULT 'pendiente'
);
```

---

## 🧾 Descripción de los campos

| Campo             | Tipo         | Descripción                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `id`             | BIGINT       | Identificador único del documento.                                          |
| `title`          | VARCHAR(255) | Título descriptivo del documento.                                           |
| `file_name`      | VARCHAR(255) | Nombre del archivo físico cargado.                                          |
| `description`    | TEXT         | Descripción adicional del contenido o propósito del documento.              |
| `author`         | VARCHAR(255) | Autor o responsable del contenido.                                          |
| `category`       | VARCHAR(100) | Categoría temática o tipo de documento.                                     |
| `tags`           | JSON         | Lista de palabras clave asociadas al documento.                             |
| `source`         | TEXT         | Ruta o URL de origen del archivo.                                           |
| `language`       | VARCHAR(50)  | Idioma principal del documento.                                             |
| `upload_date`    | DATETIME     | Fecha y hora en que el documento fue cargado.                               |
| `uploaded_by`    | VARCHAR(100) | Usuario o sistema que subió el documento.                                   |
| `processed`      | BOOLEAN      | Indica si el documento ya fue embebido y fragmentado.                       |
| `total_chunks`   | INT          | Cantidad de fragmentos generados del documento.                             |
| `total_tokens`   | INT          | Total estimado de tokens del documento (usado para costos y métricas).      |
| `embedding_model`| VARCHAR(100) | Modelo utilizado para generar los embeddings (ej. OpenAI).                  |
| `version`        | VARCHAR(50)  | Versión del documento, si aplica.                                           |
| `status`         | ENUM         | Estado del procesamiento: `pendiente`, `procesado`, o `error`.              |

---

## 🔗 Uso en el sistema RAG

- Proporciona una vista general de los documentos cargados en el sistema.
- Permite hacer seguimiento al estado de procesamiento y versión.
- Facilita filtros por categoría, autor, idioma o fecha.
- Integra con la tabla `document_chunks` a través del campo `id`.

