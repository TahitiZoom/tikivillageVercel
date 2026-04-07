import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`maintenance_mode\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`settings\`;`)
}
