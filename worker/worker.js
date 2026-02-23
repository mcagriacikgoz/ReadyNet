const { Client } = require("pg");
const { createClient } = require("redis");

const pg = new Client({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });

async function main() {
  await pg.connect();
  await redis.connect();
  console.log("Readynet Worker connected");

  while (true) {
    const item = await redis.brPop("clicks", 0); // blocks
    const payload = JSON.parse(item.element);

    await pg.query("INSERT INTO clicks(code) VALUES($1)", [payload.code]);
    console.log("click saved:", payload.code);
  }
}

main().catch((e) => {
  console.error("Worker failed:", e);
  process.exit(1);
});