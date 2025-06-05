// rag-api/app.js
// This is the main entry point for the RAG API.
// It sets up the Express server, middleware, and routes for handling PDF embedding and querying.

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'; 
import embedRoutes from './routes/embed.js';
import queryRoutes from './routes/query.js';
import documentsRouter from './routes/documents.js';
import documentChunksRouter from './routes/documentChunks.js';
import usersRouter from './routes/users.js';
import documentCategoriesRouter from './routes/documentCategories.js';
import { pool } from './services/mysqlService.js'; // Asegúrate de tener este archivo
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const MYSQL_PORT = process.env.DB_PORT || 3306;
const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';

app.use(cors()); 

app.use('/embed-pdf', embedRoutes);

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.use('/query', queryRoutes);
app.use('/documents', documentsRouter);
app.use('/document-chunks', documentChunksRouter);
app.use('/document-categories', documentCategoriesRouter);
app.use('/', usersRouter);

app.get('/', (req, res) => {
  res.send('🧠 RAG API is running...');
});

app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  // Chequeo MySQL
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`✅ MySQL running on localhost:${MYSQL_PORT}`);
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  }

  // Chequeo ChromaDB
  try {
    // Prueba primero con v2, si no, prueba con /heartbeat
    await axios.get(`${CHROMA_URL}/api/v2/heartbeat`);
    console.log(`✅ ChromaDB running on ${CHROMA_URL}`);
  } catch (err) {
    try {
      await axios.get(`${CHROMA_URL}/heartbeat`);
      console.log(`✅ ChromaDB running on ${CHROMA_URL}`);
    } catch (err2) {
      console.error('❌ Error conectando a ChromaDB:', err2.message);
    }
  }
});

//console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);


