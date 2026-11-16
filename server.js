import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const distPath = path.join(__dirname, 'dist');

// Serve static assets from dist directory
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback to index.html for all client routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (_req, res) => {
    res.status(200).send('Arthabiz build initializing. Please wait...');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Arthabiz server listening on port ${PORT}`);
});
