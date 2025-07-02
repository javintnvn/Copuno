import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // Habilita CORS para cualquier origen (frontend público)
app.use(express.json());

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;

// POST: para consultar bases de datos y crear páginas
app.post('/notion/:resource*', async (req, res) => {
  const resource = req.params.resource + (req.params[0] || '');
  const url = `https://api.notion.com/v1/${resource}`;
  try {
    const notionRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(req.body)
    });
    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET: para obtener detalles de una página Notion
app.get('/notion/pages/:id', async (req, res) => {
  const url = `https://api.notion.com/v1/pages/${req.params.id}`;
  try {
    const notionRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });
    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint raíz para probar
app.get('/', (req, res) => res.send('Notion Proxy OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Notion proxy running on port ${PORT}`));
