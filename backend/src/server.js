cat > backend/src/server.js <<'EOF'
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 5000);

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.disable('x-powered-by');

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    imageUrl: row.image_url || '',
    price: Number(row.price),
    category: row.category,
    createdAt: row.created_at,
  };
}

function cleanString(value, maxLength = 255) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'down',
      message: error.message,
    });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { q, category, sort = 'created_at', order = 'desc' } = req.query;

    const allowedSort = ['created_at', 'name', 'price'];
    const allowedOrder = ['asc', 'desc'];

    const sortColumn = allowedSort.includes(sort) ? sort : 'created_at';
    const sortOrder = allowedOrder.includes(order) ? order.toUpperCase() : 'DESC';

    const params = [];
    const where = [];

    if (q && String(q).trim()) {
      params.push(`%${String(q).trim()}%`);
      where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (category && category !== 'all') {
      params.push(String(category).trim());
      where.push(`category = $${params.length}`);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT id, name, description, image_url, price, category, created_at
       FROM products
       ${whereSql}
       ORDER BY ${sortColumn} ${sortOrder}`,
      params
    );

    res.json(result.rows.map(mapProduct));
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ message: 'Не удалось получить список товаров' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Некорректный идентификатор товара' });
    }

    const result = await pool.query(
      `SELECT id, name, description, image_url, price, category, created_at
       FROM products
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(mapProduct(result.rows[0]));
  } catch (error) {
    console.error('GET /api/products/:id error:', error);
    res.status(500).json({ message: 'Не удалось получить товар' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const name = cleanString(req.body.name, 255);
    const description = cleanString(req.body.description, 4000);
    const imageUrl = cleanString(req.body.imageUrl, 4096);
    const category = cleanString(req.body.category, 100).toLowerCase() || 'other';
    const rawPrice = req.body.price;

    if (!name) {
      return res.status(400).json({ message: 'Название товара обязательно' });
    }

    if (rawPrice === undefined || rawPrice === null || rawPrice === '') {
      return res.status(400).json({ message: 'Цена товара обязательна' });
    }

    if (typeof rawPrice !== 'number' && typeof rawPrice !== 'string') {
      return res.status(400).json({ message: 'Цена должна быть числом' });
    }

    const price = Number(rawPrice);

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: 'Цена должна быть неотрицательным числом' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, image_url, price, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, image_url, price, category, created_at`,
      [name, description, imageUrl, price, category]
    );

    res.status(201).json(mapProduct(result.rows[0]));
  } catch (error) {
    console.error('POST /api/products error:', error);
    res.status(500).json({ message: 'Не удалось добавить товар' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Некорректный идентификатор товара' });
    }

    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json({ deleted: true, id });
  } catch (error) {
    console.error('DELETE /api/products/:id error:', error);
    res.status(500).json({ message: 'Не удалось удалить товар' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Некорректный JSON в теле запроса' });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server started on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);

  server.close(async () => {
    try {
      await pool.end();
    } catch (error) {
      console.error('Error closing pool:', error);
    }

    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
EOF