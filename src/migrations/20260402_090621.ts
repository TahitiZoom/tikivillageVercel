import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`facebook_id\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_facebook_id_idx\` ON \`posts\` (\`facebook_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_facebook_id\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_facebook_id_idx\` ON \`_posts_v\` (\`version_facebook_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`posts_facebook_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`facebook_id\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_version_version_facebook_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_facebook_id\`;`)
}
