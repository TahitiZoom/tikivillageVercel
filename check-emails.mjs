import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const r = await db.execute("SELECT * FROM forms_emails");
console.log("Lignes:", r.rows.length);
r.rows.forEach(row => console.log(JSON.stringify(row)));
