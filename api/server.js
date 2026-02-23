const express = require("express");
const { nanoid } = require("nanoid");
const { Client } = require("pg");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;

const pg = new Client({ connectionString: DATABASE_URL });
const redis = createClient({ url: REDIS_URL });

async function init() {
  await pg.connect();
  await redis.connect();

  await pg.query(`
    CREATE TABLE IF NOT EXISTS links (
      code TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pg.query(`
    CREATE TABLE IF NOT EXISTS clicks (
      id BIGSERIAL PRIMARY KEY,
      code TEXT NOT NULL,
      ts TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

app.get("/health", async (req, res) => {
  try {
    await pg.query("SELECT 1");
    await redis.ping();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });

  const code = nanoid(7);
  await pg.query("INSERT INTO links(code, url) VALUES($1,$2)", [code, url]);

  res.json({ short: `${PUBLIC_BASE_URL}/r/${code}`, code });
});

app.get("/r/:code", async (req, res) => {
  const code = req.params.code;

  const cached = await redis.get(`link:${code}`);
  if (cached) {
    await redis.lPush("clicks", JSON.stringify({ code }));
    return res.redirect(cached);
  }

  const { rows } = await pg.query("SELECT url FROM links WHERE code=$1", [code]);
  if (!rows.length) return res.status(404).send("Not found");

  const url = rows[0].url;

  await redis.setEx(`link:${code}`, 300, url);
  await redis.lPush("clicks", JSON.stringify({ code }));

  res.redirect(url);
});

app.get("/stats/:code", async (req, res) => {
  const { rows } = await pg.query(
    "SELECT COUNT(*)::int AS count FROM clicks WHERE code=$1",
    [req.params.code]
  );

  res.json({ code: req.params.code, clicks: rows[0].count });
});

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Readynet API running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Init failed:", e);
    process.exit(1);
  });