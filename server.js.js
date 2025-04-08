console.log('Starting server...');
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const STORAGE_DIR = './blobs';

app.use(express.json());

// Make blobs folder if it doesn't exist
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

// POST - Create a blob
app.post('/api/jsonBlob', (req, res) => {
  const id = uuidv4();
  const path = `${STORAGE_DIR}/${id}.json`;
  fs.writeFileSync(path, JSON.stringify(req.body, null, 2));
  res.status(201).location(`/api/jsonBlob/${id}`).json({ id });
});

// GET - Read blob
app.get('/api/jsonBlob/:id', (req, res) => {
  const path = `${STORAGE_DIR}/${req.params.id}.json`;
  if (!fs.existsSync(path)) return res.sendStatus(404);
  const data = fs.readFileSync(path);
  res.json(JSON.parse(data));
});

// PUT - Update blob
app.put('/api/jsonBlob/:id', (req, res) => {
  const path = `${STORAGE_DIR}/${req.params.id}.json`;
  if (!fs.existsSync(path)) return res.sendStatus(404);
  fs.writeFileSync(path, JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// DELETE - Delete blob
app.delete('/api/jsonBlob/:id', (req, res) => {
  const path = `${STORAGE_DIR}/${req.params.id}.json`;
  if (!fs.existsSync(path)) return res.sendStatus(404);
  fs.unlinkSync(path);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`✅ JSONBlob server running at http://localhost:${PORT}`);
});

