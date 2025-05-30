# RAGInternos - Documentación Técnica y Arquitectónica

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura General](#arquitectura-general)
- [Componentes Principales](#componentes-principales)
- [Modelo de Datos](#modelo-de-datos)
- [Flujos de Procesos](#flujos-de-procesos)
- [Integraciones y Dependencias](#integraciones-y-dependencias)
- [Consideraciones de Seguridad](#consideraciones-de-seguridad)
- [Escalabilidad y Mantenimiento](#escalabilidad-y-mantenimiento)
- [Diagramas Mermaid](#diagramas-mermaid)
- [Glosario](#glosario)

---

## Visión General

RAGInternos es una API orientada a la gestión, procesamiento y consulta de documentos, con enfoque en la integración de técnicas de Recuperación Aumentada por Generación (RAG). El sistema permite almacenar, procesar, consultar y servir documentos, principalmente en formato PDF, y está preparado para integrarse con modelos de embeddings y flujos de procesamiento de lenguaje natural.

---

## Arquitectura General

La arquitectura de RAGInternos es modular y orientada a servicios. Utiliza Node.js y Express para exponer una API REST que gestiona documentos y metadatos almacenados en MySQL. Los archivos PDF se guardan en el sistema de archivos local. El sistema está preparado para integrarse con servicios de embeddings para procesamiento semántico, y cada componente tiene responsabilidades claras para facilitar la escalabilidad y el mantenimiento.

El sistema sigue una arquitectura modular basada en servicios, donde cada módulo se encarga de una responsabilidad específica (gestión de documentos, procesamiento, almacenamiento, etc.). Utiliza Node.js como backend, Express para la gestión de rutas HTTP y MySQL como base de datos principal.

```mermaid
flowchart TD
    Client[Cliente/Frontend]
    API[API Express/Node.js]
    DB[(MySQL)]
    FS[FileSystem_PDFs]
    Embeddings[Servicio_de_Embeddings]
    Client -- "HTTP/REST" --> API
    API -- "SQL" --> DB
    API -- "Archivos" --> FS
    API -- "Embeddings API" --> Embeddings
```

---

## Componentes Principales

### 1. API Express

- Gestiona rutas para CRUD de documentos.
- Expone endpoints para subir, consultar, modificar y eliminar documentos.
- Sirve archivos PDF almacenados en el sistema de archivos.

### 2. Servicio de Documentos (`documentService.js`)

- Lógica de negocio para manipulación de documentos.
- Interacción con la base de datos y el sistema de archivos.
- Serialización/deserialización de metadatos y tags.

### 3. Base de Datos MySQL

- Almacena metadatos de documentos.
- Estructura flexible para soportar tags, versiones y modelos de embeddings.

### 4. Sistema de Archivos

- Almacena los archivos PDF subidos.
- Integrado con la API para servir archivos bajo demanda.

### 5. Servicio de Embeddings (Integración)

- Preparado para interactuar con modelos de embeddings (ej. OpenAI, local).
- Almacena información sobre el modelo usado y los tokens generados.

---

## Modelo de Datos

La tabla principal es `documents`, que contiene los siguientes campos clave:

- `id`: Identificador único.
- `title`, `file_name`, `description`, `author`, `category`
- `tags`: Array serializado en JSON.
- `source`, `language`, `upload_date`, `uploaded_by`
- `processed`, `total_chunks`, `total_tokens`
- `embedding_model`, `version`, `status`

```mermaid
erDiagram
    DOCUMENTS {
        int id PK
        string title
        string file_name
        string description
        string author
        string category
        string tags
        string source
        string language
        datetime upload_date
        string uploaded_by
        bool processed
        int total_chunks
        int total_tokens
        string embedding_model
        string version
        string status
    }
```

---

## Flujos de Procesos

### 1. Subida de Documento

```mermaid
sequenceDiagram
    participant User
    participant API
    participant FS as FileSystem
    participant DB as MySQL

    User->>API: POST /documents (con archivo PDF y metadatos)
    API->>FS: Guarda archivo PDF
    API->>DB: Inserta metadatos en documents
    API-->>User: Responde con ID y metadatos
```

### 2. Consulta de Documento

```mermaid
sequenceDiagram
    participant User
    participant API
    participant DB as MySQL

    User->>API: GET /documents/:id
    API->>DB: Consulta documento por ID
    API-->>User: Devuelve metadatos
```

### 3. Descarga de PDF

```mermaid
sequenceDiagram
    participant User
    participant API
    participant FS as FileSystem

    User->>API: GET /documents/:id/file
    API->>FS: Lee archivo PDF
    API-->>User: Envía archivo PDF
```

---

## Integraciones y Dependencias

- **Node.js**: Entorno de ejecución principal.
- **Express**: Framework para la API REST.
- **MySQL**: Base de datos relacional.
- **fs, path**: Módulos nativos para manejo de archivos.
- **Servicios de Embeddings**: Integración opcional para procesamiento semántico.

---

## Consideraciones de Seguridad

- Validación de existencia de archivos antes de servirlos.
- Serialización segura de campos como `tags`.
- Uso de parámetros preparados en SQL para evitar inyección.
- Control de acceso y autenticación (a implementar según necesidades).

---

## Escalabilidad y Mantenimiento

- Separación de lógica de negocio y acceso a datos.
- Preparado para integración con servicios externos (embeddings, almacenamiento en la nube).
- Modularidad para facilitar pruebas y mantenimiento.
- Uso de paginación en consultas para evitar sobrecarga.

---

## Diagramas Mermaid

### Arquitectura General

```mermaid
flowchart TD
    Client[Cliente/Frontend]
    API[API Express/Node.js]
    DB[(MySQL)]
    FS[FileSystem_PDFs]
    Embeddings[Servicio_de_Embeddings]
    Client -- "HTTP/REST" --> API
    API -- "SQL" --> DB
    API -- "Archivos" --> FS
    API -- "Embeddings API" --> Embeddings
```

### Modelo de Datos

```mermaid
erDiagram
    DOCUMENTS {
        int id PK
        string title
        string file_name
        string description
        string author
        string category
        string tags
        string source
        string language
        datetime upload_date
        string uploaded_by
        bool processed
        int total_chunks
        int total_tokens
        string embedding_model
        string version
        string status
    }
```

### Flujo de Subida de Documento

```mermaid
sequenceDiagram
    participant User
    participant API
    participant FS as FileSystem
    participant DB as MySQL

    User->>API: POST /documents (con archivo PDF y metadatos)
    API->>FS: Guarda archivo PDF
    API->>DB: Inserta metadatos en documents
    API-->>User: Responde con ID y metadatos
```

---

## Glosario

- **RAG**: Recuperación Aumentada por Generación.
- **Embeddings**: Representaciones vectoriales de texto para búsqueda semántica.
- **CRUD**: Operaciones de Crear, Leer, Actualizar y Eliminar.
- **API REST**: Interfaz de programación de aplicaciones basada en HTTP.

---

> _Este documento debe mantenerse actualizado conforme evolucione la arquitectura y los componentes del sistema._
