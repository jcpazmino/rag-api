// rag-api/app.js
// This is the main entry point for the RAG API.
// It sets up the Express server, middleware, and routes for handling PDF embedding and querying.

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fileUpload from 'express-fileupload';
import embedRoutes from './routes/embed.js';
import queryRoutes from './routes/query.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/embed-pdf', embedRoutes);
app.use('/query', queryRoutes);

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('🧠 RAG API is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
