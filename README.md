# rag-api

## Project Overview
This project is a RESTful API designed to handle embedding functionalities and querying operations. It provides endpoints for processing and managing data, particularly focusing on embeddings and PDF file handling.

## File Structure
The project is organized as follows:

```
rag-api/
├── .env                  # Environment variables for the application
├── app.js                # Main entry point of the application
├── routes/               # Contains route definitions
│   ├── embed.js          # Routes for embedding functionalities
│   └── query.js          # Routes for querying functionalities
├── services/             # Contains business logic
│   ├── chromaService.js  # Interacts with the Chroma service
│   ├── embeddingService.js# Handles embedding operations
│   └── pdfService.js     # Processes PDF files
├── utils/                # Utility functions
│   └── chunker.js        # Splits data into chunks
├── data/                 # Data storage
│   └── uploads/          # Directory for uploaded PDF files
├── embeddings.json       # Temporarily stores embeddings
├── package.json          # npm configuration file
└── README.md             # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Create a `.env` file and populate it with the necessary environment variables.
4. Run `npm install` to install the required dependencies.
5. Start the application using `node app.js`.

## Usage Guidelines
- Use the `/embed` route to handle embedding requests.
- Use the `/query` route to perform queries on the data.
- Uploaded PDF files should be placed in the `data/uploads` directory.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

# RAG API – OpenAI + ChromaDB

API REST en Node.js para procesar documentos PDF, generar embeddings con OpenAI y realizar búsquedas semánticas usando ChromaDB.

## 🚀 Funcionalidades

- 📄 Carga de PDF y fragmentación por tokens (precisión real con tiktoken)
- 🧠 Generación de embeddings con OpenAI
- 🗃️ Almacenamiento en ChromaDB con metadatos
- 🔍 Búsqueda semántica por lenguaje natural (consultas con contexto)

## 📦 Requisitos

- Node.js 18+
- Docker (para ChromaDB)
- Clave de API de OpenAI

## 🔧 Instalación

```bash
git clone https://github.com/jcpazmino/rag-api.git
cd rag-api
npm install
cp .env.example .env
# Edita .env con tu API key de OpenAI
```

### 🚢 Ejecutar ChromaDB

```bash
docker run -d -p 8000:8000 ghcr.io/chroma-core/chroma:latest
```

## 🧪 Endpoints

### POST `/embed-pdf`

Carga un PDF, lo fragmenta, genera embeddings y los guarda en Chroma.

**Body (form-data):**
- `pdf`: archivo PDF

**Respuesta:**
```json
{
  "message": "✅ 20 fragmentos procesados y almacenados en Chroma."
}
```

---

### POST `/query`

Envía una pregunta y recibe los fragmentos más relevantes del PDF.

**Body (JSON):**
```json
{
  "pregunta": "¿Cuáles son los principios del currículo?"
}
```

**Respuesta:**
```json
{
  "pregunta": "...",
  "resultados": [
    { "texto": "...", "score": 0.13 },
    ...
  ]
}
```

---

## 📁 Estructura del proyecto

```
rag-api/
├── routes/
├── services/
├── utils/
├── data/uploads/
├── .env
├── app.js
└── package.json
```

---

## 🧠 Stack

- Express.js
- OpenAI Embeddings
- ChromaDB (REST)
- pdf-parse + tiktoken

---

## 📜 Licencia

MIT

## Databases Used

This application uses two main databases:

1. **ChromaDB**  
   - Vector database for storing and querying embeddings and metadata of document fragments.
   - Accessed via its REST API (default: `http://localhost:8000`).
   - Used for semantic search and context retrieval.

2. **MySQL**  
   - Relational database for storing structured information about documents and their fragments (tables like `documents` and `document_chunks`).
   - Accessed via the `mysql2` client from Node.js.
   - Used for administration, querying, and management of documents and their structured metadata.

**Summary:**  
The app uses **ChromaDB** for embeddings and semantic search, and **MySQL** for structured document and fragment management.

## ChromaDB Setup

The command to create and run a ChromaDB container using Docker is:

```sh
docker run -d -p 8000:8000 ghcr.io/chroma-core/chroma:latest
```

By default, the ChromaDB REST API will be available at `http://localhost:8000`.

**Database name used in ChromaDB:**  
The application uses the database named:

```
rag_api
```

This is set via the environment variable `CHROMA_DATABASE=rag_api` in your `.env` file.
**To create the database in PowerShell:**
```powershell
curl -Method POST http://localhost:8000/api/v2/tenants/default_tenant/databases `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name": "rag_api"}'
```

**To validate if the database exists:**
```powershell
curl http://localhost:8000/api/v2/tenants/default_tenant/databases
```

## MySQL Setup

The command to create and run a MySQL container using Docker is:

```sh
docker run --name mysql-RAG -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=ragdb -p 3306:3306 -d mysql:8
```

- `--name mysql-RAG` → container name
- `-e MYSQL_ROOT_PASSWORD=1234` → root user password
- `-e MYSQL_DATABASE=ragdb` → database name to be created automatically
- `-p 3306:3306` → exposes port 3306 for external connections
- `-d mysql:8` → uses the official MySQL version 8 image

This will start a MySQL container accessible at `localhost:3306` with the database `ragdb` and password `1234`.

El comando para iniciar la app es:
```sh
node app.js
```