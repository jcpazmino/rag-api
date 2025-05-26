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

