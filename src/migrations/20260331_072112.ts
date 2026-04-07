import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`cover_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`posts_cover_image_idx\` ON \`posts\` (\`cover_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_cover_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_cover_image_idx\` ON \`_posts_v\` (\`version_cover_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`hero_image_id\` integer,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`facebook_url\` text,
  	\`published_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "title", "hero_image_id", "content", "meta_title", "meta_image_id", "meta_description", "facebook_url", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "title", "hero_image_id", "content", "meta_title", "meta_image_id", "meta_description", "facebook_url", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`posts_hero_image_idx\` ON \`posts\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_hero_image_id\` integer,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_facebook_url\` text,
  	\`version_published_at\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_title", "version_hero_image_id", "version_content", "version_meta_title", "version_meta_image_id", "version_meta_description", "version_facebook_url", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_hero_image_id", "version_content", "version_meta_title", "version_meta_image_id", "version_meta_description", "version_facebook_url", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_hero_image_idx\` ON \`_posts_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
}
