const { createClient } = require('@libsql/client');
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%form%'")
  .then(r => r.rows.forEach(row => console.log(row.name)))
  .catch(e => console.error(e));
