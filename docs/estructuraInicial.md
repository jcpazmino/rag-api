## File Structure
The project is organized as follows:

rag-api/
├── .env
├── app.js
├── routes/
│   ├── embed.js
│   ├── query.js
│   ├── documents.js
│   └── documentChunks.js
├── services/
│   ├── mysqlService.js
│   └── rag/
│       ├── chromaService.js
│       ├── embeddingService.js
│       ├── pdfService.js
│       ├── documentService.js
│       └── documentChunkService.js
├── utils/
│   └── chunker.js
├── data/
│   └── uploads/            # PDFs subidos
├── docs/
│   ├── estructuraInicial.md
│   ├── documentChunks.md
│   └── documents.md
├── embeddings.json         # Embeddings almacenados (temporalmente)
├── package.json
