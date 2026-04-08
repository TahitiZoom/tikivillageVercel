import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_locales\` (
  	\`title\` text,
  	\`hero_type\` text DEFAULT 'lowImpact',
  	\`hero_rich_text\` text,
  	\`hero_media_id\` integer,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_hero_hero_media_idx\` ON \`pages_locales\` (\`hero_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_locales\` (
  	\`version_title\` text,
  	\`version_hero_type\` text DEFAULT 'lowImpact',
  	\`version_hero_rich_text\` text,
  	\`version_hero_media_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v_locales\` (\`version_hero_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`posts_locales\` (
  	\`title\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`posts_meta_meta_image_idx\` ON \`posts_locales\` (\`meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_posts_v_locales\` (
  	\`version_title\` text,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`forms_blocks_checkbox_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_checkbox\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`forms_blocks_checkbox_locales_locale_parent_id_unique\` ON \`forms_blocks_checkbox_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_country_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_country\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_country_locales_locale_parent_id_unique\` ON \`forms_blocks_country_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_email_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_email\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_email_locales_locale_parent_id_unique\` ON \`forms_blocks_email_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_message_locales\` (
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_message\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_message_locales_locale_parent_id_unique\` ON \`forms_blocks_message_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_number_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_number\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_number_locales_locale_parent_id_unique\` ON \`forms_blocks_number_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_options_locales_locale_parent_id_unique\` ON \`forms_blocks_select_options_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_locales_locale_parent_id_unique\` ON \`forms_blocks_select_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_state_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_state\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_state_locales_locale_parent_id_unique\` ON \`forms_blocks_state_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_text_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_text_locales_locale_parent_id_unique\` ON \`forms_blocks_text_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_textarea\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_textarea_locales_locale_parent_id_unique\` ON \`forms_blocks_textarea_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_emails_locales\` (
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_emails\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_emails_locales_locale_parent_id_unique\` ON \`forms_emails_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_locales\` (
  	\`submit_button_label\` text,
  	\`confirmation_message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_locales_locale_parent_id_unique\` ON \`forms_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`search_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`search_locales_locale_parent_id_unique\` ON \`search_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`published_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_pages\`("id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`pages\`;`,
  )
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_published_at\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new__pages_v\`("id", "parent_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave") SELECT "id", "parent_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave" FROM \`_pages_v\`;`,
  )
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v\` RENAME TO \`_pages_v\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer,
  	\`published_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_posts\`("id", "hero_image_id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "hero_image_id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`posts\`;`,
  )
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`CREATE INDEX \`posts_hero_image_idx\` ON \`posts\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_hero_image_id\` integer,
  	\`version_published_at\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_hero_image_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave") SELECT "id", "parent_id", "version_hero_image_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave" FROM \`_posts_v\`;`,
  )
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_hero_image_idx\` ON \`_posts_v\` (\`version_hero_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_published_locale_idx\` ON \`_posts_v\` (\`published_locale\`);`,
  )
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
  await db.run(sql`DROP INDEX \`pages_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_posts_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_categories_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_rels\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`pages_rels_locale_idx\` ON \`pages_rels\` (\`locale\`);`)
  await db.run(
    sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_rels_posts_id_idx\` ON \`pages_rels\` (\`posts_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`,\`locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_posts_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_categories_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_rels\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_locale_idx\` ON \`_pages_v_rels\` (\`locale\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_posts_id_idx\` ON \`_pages_v_rels\` (\`posts_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`,\`locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_rels_posts_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`header_rels\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`header_rels_locale_idx\` ON \`header_rels\` (\`locale\`);`)
  await db.run(
    sql`CREATE INDEX \`header_rels_pages_id_idx\` ON \`header_rels\` (\`pages_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_rels_posts_id_idx\` ON \`header_rels\` (\`posts_id\`,\`locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_rels_posts_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`footer_rels\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`footer_rels_locale_idx\` ON \`footer_rels\` (\`locale\`);`)
  await db.run(
    sql`CREATE INDEX \`footer_rels_pages_id_idx\` ON \`footer_rels\` (\`pages_id\`,\`locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_rels_posts_id_idx\` ON \`footer_rels\` (\`posts_id\`,\`locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_hero_links\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_hero_links_locale_idx\` ON \`pages_hero_links\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_cta_links\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_links_locale_idx\` ON \`pages_blocks_cta_links\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_cta\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_locale_idx\` ON \`pages_blocks_cta\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_columns_locale_idx\` ON \`pages_blocks_content_columns\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_locale_idx\` ON \`pages_blocks_content\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_media_block\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_media_block_locale_idx\` ON \`pages_blocks_media_block\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_archive_locale_idx\` ON \`pages_blocks_archive\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_blocks_form_block\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_form_block_locale_idx\` ON \`pages_blocks_form_block\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_version_hero_links\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_links_locale_idx\` ON \`_pages_v_version_hero_links\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta_links\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_links_locale_idx\` ON \`_pages_v_blocks_cta_links\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_locale_idx\` ON \`_pages_v_blocks_cta\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_columns_locale_idx\` ON \`_pages_v_blocks_content_columns\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_locale_idx\` ON \`_pages_v_blocks_content\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_media_block\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_media_block_locale_idx\` ON \`_pages_v_blocks_media_block\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_archive_locale_idx\` ON \`_pages_v_blocks_archive\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_form_block\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_form_block_locale_idx\` ON \`_pages_v_blocks_form_block\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`categories_breadcrumbs\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`categories_breadcrumbs_locale_idx\` ON \`categories_breadcrumbs\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`header_nav_items\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`header_nav_items_locale_idx\` ON \`header_nav_items\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`footer_nav_items\` ADD \`_locale\` text NOT NULL;`)
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_locale_idx\` ON \`footer_nav_items\` (\`_locale\`);`,
  )
  await db.run(sql`ALTER TABLE \`forms_blocks_checkbox\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_country\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_email\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_message\` DROP COLUMN \`message\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_number\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select_options\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select\` DROP COLUMN \`default_value\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_state\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_text\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_text\` DROP COLUMN \`default_value\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_textarea\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_textarea\` DROP COLUMN \`default_value\`;`)
  await db.run(sql`ALTER TABLE \`forms_emails\` DROP COLUMN \`subject\`;`)
  await db.run(sql`ALTER TABLE \`forms_emails\` DROP COLUMN \`message\`;`)
  await db.run(sql`ALTER TABLE \`forms\` DROP COLUMN \`submit_button_label\`;`)
  await db.run(sql`ALTER TABLE \`forms\` DROP COLUMN \`confirmation_message\`;`)
  await db.run(sql`ALTER TABLE \`search\` DROP COLUMN \`title\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_country_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_state_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_emails_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_locales\`;`)
  await db.run(sql`DROP TABLE \`search_locales\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_links_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_hero_links\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_cta_links_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta_links\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_cta_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_content_columns_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_content_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_media_block_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_media_block\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_archive_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_blocks_form_block_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_form_block\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_locale_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_posts_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_rels_categories_id_idx\`;`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_posts_id_idx\` ON \`pages_rels\` (\`posts_id\`);`)
  await db.run(
    sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_rels\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_links_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_hero_links\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_cta_links_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta_links\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_cta_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_content_columns_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_content_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_media_block_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_media_block\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_archive_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_blocks_form_block_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_form_block\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_snapshot_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_published_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_title\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_type\` text DEFAULT 'lowImpact';`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_rich_text\` text;`)
  await db.run(
    sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_title\` text;`)
  await db.run(
    sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_description\` text;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v\` (\`version_hero_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`published_locale\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_locale_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_posts_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_rels_categories_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_posts_id_idx\` ON \`_pages_v_rels\` (\`posts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_rels\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_snapshot_idx\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_published_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_title\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_content\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_title\` text;`)
  await db.run(
    sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_description\` text;`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v\` (\`version_meta_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`published_locale\`;`)
  await db.run(sql`DROP INDEX \`categories_breadcrumbs_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`categories_breadcrumbs\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`header_nav_items_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`header_nav_items\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`header_rels_locale_idx\`;`)
  await db.run(sql`DROP INDEX \`header_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_rels_posts_id_idx\`;`)
  await db.run(sql`CREATE INDEX \`header_rels_pages_id_idx\` ON \`header_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`header_rels_posts_id_idx\` ON \`header_rels\` (\`posts_id\`);`)
  await db.run(sql`ALTER TABLE \`header_rels\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`footer_nav_items_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`footer_nav_items\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX \`footer_rels_locale_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_rels_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_rels_posts_id_idx\`;`)
  await db.run(sql`CREATE INDEX \`footer_rels_pages_id_idx\` ON \`footer_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_posts_id_idx\` ON \`footer_rels\` (\`posts_id\`);`)
  await db.run(sql`ALTER TABLE \`footer_rels\` DROP COLUMN \`locale\`;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_type\` text DEFAULT 'lowImpact';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_rich_text\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_media_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_description\` text;`)
  await db.run(sql`CREATE INDEX \`pages_hero_hero_media_idx\` ON \`pages\` (\`hero_media_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_description\` text;`)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`forms_blocks_checkbox\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_country\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_email\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_message\` ADD \`message\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_number\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select_options\` ADD \`label\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_select\` ADD \`default_value\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_state\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_text\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_text\` ADD \`default_value\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_textarea\` ADD \`label\` text;`)
  await db.run(sql`ALTER TABLE \`forms_blocks_textarea\` ADD \`default_value\` text;`)
  await db.run(
    sql`ALTER TABLE \`forms_emails\` ADD \`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL;`,
  )
  await db.run(sql`ALTER TABLE \`forms_emails\` ADD \`message\` text;`)
  await db.run(sql`ALTER TABLE \`forms\` ADD \`submit_button_label\` text;`)
  await db.run(sql`ALTER TABLE \`forms\` ADD \`confirmation_message\` text;`)
  await db.run(sql`ALTER TABLE \`search\` ADD \`title\` text;`)
}
