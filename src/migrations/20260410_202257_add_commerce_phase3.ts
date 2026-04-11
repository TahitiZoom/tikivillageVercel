import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

const isIgnorableMigrationError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  return [
    'already exists',
    'duplicate column name',
    'duplicate key name',
    'duplicate index name',
    'no such index',
    'no such column',
  ].some((fragment) => message.includes(fragment))
}

const safeRun = async (db: MigrateUpArgs['db'] | MigrateDownArgs['db'], statement: ReturnType<typeof sql>) => {
  try {
    await db.run(statement)
  } catch (error) {
    if (!isIgnorableMigrationError(error)) {
      throw error
    }
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await safeRun(db, sql`CREATE TABLE \`products_booking_available_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE INDEX \`products_booking_available_days_order_idx\` ON \`products_booking_available_days\` (\`order\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_booking_available_days_parent_idx\` ON \`products_booking_available_days\` (\`parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`products_booking_blocked_dates\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text,
  	\`reason\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE INDEX \`products_booking_blocked_dates_order_idx\` ON \`products_booking_blocked_dates\` (\`_order\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_booking_blocked_dates_parent_id_idx\` ON \`products_booking_blocked_dates\` (\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`products_wedding_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`price\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE INDEX \`products_wedding_options_order_idx\` ON \`products_wedding_options\` (\`_order\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_wedding_options_parent_id_idx\` ON \`products_wedding_options\` (\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`products_wedding_options_locales\` (
  	\`name\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_wedding_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`products_wedding_options_locales_locale_parent_id_unique\` ON \`products_wedding_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`products_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE INDEX \`products_gallery_order_idx\` ON \`products_gallery\` (\`_order\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_gallery_parent_id_idx\` ON \`products_gallery\` (\`_parent_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_gallery_image_idx\` ON \`products_gallery\` (\`image_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`status\` text DEFAULT 'active',
  	\`pricing_currency\` text DEFAULT 'XPF',
  	\`pricing_has_person_types\` integer DEFAULT true,
  	\`pricing_price_adult\` numeric NOT NULL,
  	\`pricing_price_child\` numeric,
  	\`pricing_promo_adult\` numeric,
  	\`pricing_promo_child\` numeric,
  	\`pricing_display_price\` numeric,
  	\`transfer_options_has_transfer\` integer DEFAULT false,
  	\`transfer_options_transfer_price_adult\` numeric DEFAULT 2600,
  	\`transfer_options_transfer_price_child\` numeric DEFAULT 1600,
  	\`booking_is_bookable\` integer DEFAULT false,
  	\`booking_min_persons\` numeric DEFAULT 1,
  	\`booking_max_persons\` numeric DEFAULT 25,
  	\`booking_min_advance_days\` numeric DEFAULT 0,
  	\`booking_max_advance_months\` numeric DEFAULT 12,
  	\`cancellation_fee24h\` numeric DEFAULT 100,
  	\`cancellation_fee7days\` numeric DEFAULT 30,
  	\`cancellation_fee_over8days\` numeric DEFAULT 0,
  	\`external_booking_url\` text,
  	\`featured_image_id\` integer,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_featured_image_idx\` ON \`products\` (\`featured_image_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await safeRun(db, sql`CREATE TABLE \`products_locales\` (
  	\`name\` text NOT NULL,
  	\`short_description\` text,
  	\`description\` text,
  	\`booking_time_slot\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`products_locales_locale_parent_id_unique\` ON \`products_locales\` (\`_locale\`,\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`booking_reference\` text NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`date\` text NOT NULL,
  	\`participants_adults\` numeric DEFAULT 1 NOT NULL,
  	\`participants_children\` numeric DEFAULT 0,
  	\`options_transfer_adults\` numeric DEFAULT 0,
  	\`options_transfer_children\` numeric DEFAULT 0,
  	\`promo_code\` text,
  	\`is_promo_applied\` integer DEFAULT false,
  	\`breakdown_subtotal_persons\` numeric,
  	\`breakdown_subtotal_transfer\` numeric,
  	\`breakdown_discount\` numeric,
  	\`breakdown_total_amount\` numeric,
  	\`total_amount\` numeric NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`customer_id\` integer,
  	\`guest_info_first_name\` text,
  	\`guest_info_last_name\` text,
  	\`guest_info_email\` text,
  	\`guest_info_phone\` text,
  	\`guest_info_country\` text,
  	\`order_id\` integer,
  	\`notes\` text,
  	\`customer_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`bookings_booking_reference_idx\` ON \`bookings\` (\`booking_reference\`);`)
  await safeRun(db, sql`CREATE INDEX \`bookings_product_idx\` ON \`bookings\` (\`product_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`bookings_customer_idx\` ON \`bookings\` (\`customer_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`bookings_order_idx\` ON \`bookings\` (\`order_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await safeRun(db, sql`CREATE TABLE \`orders_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`unit_price\` numeric NOT NULL,
  	\`subtotal\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`CREATE INDEX \`orders_line_items_order_idx\` ON \`orders_line_items\` (\`_order\`);`)
  await safeRun(db, sql`CREATE INDEX \`orders_line_items_parent_id_idx\` ON \`orders_line_items\` (\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order_number\` text NOT NULL,
  	\`booking_id\` integer NOT NULL,
  	\`customer_id\` integer,
  	\`billing_first_name\` text NOT NULL,
  	\`billing_last_name\` text NOT NULL,
  	\`billing_email\` text NOT NULL,
  	\`billing_phone\` text,
  	\`billing_company\` text,
  	\`billing_address1\` text,
  	\`billing_address2\` text,
  	\`billing_city\` text,
  	\`billing_region\` text,
  	\`billing_postal_code\` text,
  	\`billing_country\` text DEFAULT 'PF',
  	\`total_amount\` numeric NOT NULL,
  	\`currency\` text DEFAULT 'XPF',
  	\`payment_payment_status\` text DEFAULT 'pending' NOT NULL,
  	\`payment_payzen_transaction_id\` text,
  	\`payment_payzen_order_id\` text,
  	\`payment_payzen_trans_status\` text,
  	\`payment_payzen_auth_result\` text,
  	\`payment_payzen_raw_response\` text,
  	\`payment_paid_at\` text,
  	\`order_notes\` text,
  	\`admin_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`orders_order_number_idx\` ON \`orders\` (\`order_number\`);`)
  await safeRun(db, sql`CREATE INDEX \`orders_booking_idx\` ON \`orders\` (\`booking_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await safeRun(db, sql`PRAGMA foreign_keys=OFF;`)
  await safeRun(db, sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`published_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await safeRun(db, sql`INSERT INTO \`__new_pages\`("id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`pages\`;`)
  await safeRun(db, sql`DROP TABLE \`pages\`;`)
  await safeRun(db, sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await safeRun(db, sql`PRAGMA foreign_keys=ON;`)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await safeRun(db, sql`CREATE TABLE \`__new__pages_v\` (
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
  await safeRun(db, sql`INSERT INTO \`__new__pages_v\`("id", "parent_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave") SELECT "id", "parent_id", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest", "autosave" FROM \`_pages_v\`;`)
  await safeRun(db, sql`DROP TABLE \`_pages_v\`;`)
  await safeRun(db, sql`ALTER TABLE \`__new__pages_v\` RENAME TO \`_pages_v\`;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await safeRun(db, sql`DROP INDEX \`pages_meta_meta_image_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_locales\` ADD \`title\` text;`)
  await safeRun(db, sql`ALTER TABLE \`pages_locales\` ADD \`hero_type\` text DEFAULT 'lowImpact';`)
  await safeRun(db, sql`ALTER TABLE \`pages_locales\` ADD \`hero_rich_text\` text;`)
  await safeRun(db, sql`ALTER TABLE \`pages_locales\` ADD \`hero_media_id\` integer REFERENCES media(id);`)
  await safeRun(db, sql`CREATE INDEX \`pages_hero_hero_media_idx\` ON \`pages_locales\` (\`hero_media_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`);`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_pages_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_posts_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_categories_id_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_rels\` ADD \`locale\` text;`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_locale_idx\` ON \`pages_rels\` (\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`,\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_posts_id_idx\` ON \`pages_rels\` (\`posts_id\`,\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`,\`locale\`);`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_version_meta_version_meta_image_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_title\` text;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_hero_type\` text DEFAULT 'lowImpact';`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_hero_rich_text\` text;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_hero_media_id\` integer REFERENCES media(id);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v_locales\` (\`version_hero_media_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`);`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_pages_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_posts_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_categories_id_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_rels\` ADD \`locale\` text;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_locale_idx\` ON \`_pages_v_rels\` (\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`,\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_posts_id_idx\` ON \`_pages_v_rels\` (\`posts_id\`,\`locale\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`,\`locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_hero_links\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_hero_links_locale_idx\` ON \`pages_hero_links\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_cta_links\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_cta_links_locale_idx\` ON \`pages_blocks_cta_links\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_cta\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_cta_locale_idx\` ON \`pages_blocks_cta\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_content_columns_locale_idx\` ON \`pages_blocks_content_columns\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_content\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_content_locale_idx\` ON \`pages_blocks_content\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_media_block\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_media_block_locale_idx\` ON \`pages_blocks_media_block\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_archive\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_archive_locale_idx\` ON \`pages_blocks_archive\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_form_block\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`pages_blocks_form_block_locale_idx\` ON \`pages_blocks_form_block\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_version_hero_links\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_hero_links_locale_idx\` ON \`_pages_v_version_hero_links\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_cta_links\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_cta_links_locale_idx\` ON \`_pages_v_blocks_cta_links\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_cta\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_cta_locale_idx\` ON \`_pages_v_blocks_cta\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_content_columns_locale_idx\` ON \`_pages_v_blocks_content_columns\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_content\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_content_locale_idx\` ON \`_pages_v_blocks_content\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_media_block\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_media_block_locale_idx\` ON \`_pages_v_blocks_media_block\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_archive\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_archive_locale_idx\` ON \`_pages_v_blocks_archive\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_form_block\` ADD \`_locale\` text NOT NULL;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_blocks_form_block_locale_idx\` ON \`_pages_v_blocks_form_block\` (\`_locale\`);`)
  await safeRun(db, sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'customer';`)
  await safeRun(db, sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await safeRun(db, sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`bookings_id\` integer REFERENCES bookings(id);`)
  await safeRun(db, sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`orders_id\` integer REFERENCES orders(id);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await safeRun(db, sql`DROP TABLE \`products_booking_available_days\`;`)
  await safeRun(db, sql`DROP TABLE \`products_booking_blocked_dates\`;`)
  await safeRun(db, sql`DROP TABLE \`products_wedding_options\`;`)
  await safeRun(db, sql`DROP TABLE \`products_wedding_options_locales\`;`)
  await safeRun(db, sql`DROP TABLE \`products_gallery\`;`)
  await safeRun(db, sql`DROP TABLE \`products\`;`)
  await safeRun(db, sql`DROP TABLE \`products_locales\`;`)
  await safeRun(db, sql`DROP TABLE \`bookings\`;`)
  await safeRun(db, sql`DROP TABLE \`orders_line_items\`;`)
  await safeRun(db, sql`DROP TABLE \`orders\`;`)
  await safeRun(db, sql`PRAGMA foreign_keys=OFF;`)
  await safeRun(db, sql`CREATE TABLE \`__new_pages_locales\` (
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`INSERT INTO \`__new_pages_locales\`("meta_title", "meta_image_id", "meta_description", "id", "_locale", "_parent_id") SELECT "meta_title", "meta_image_id", "meta_description", "id", "_locale", "_parent_id" FROM \`pages_locales\`;`)
  await safeRun(db, sql`DROP TABLE \`pages_locales\`;`)
  await safeRun(db, sql`ALTER TABLE \`__new_pages_locales\` RENAME TO \`pages_locales\`;`)
  await safeRun(db, sql`PRAGMA foreign_keys=ON;`)
  await safeRun(db, sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`__new__pages_v_locales\` (
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`INSERT INTO \`__new__pages_v_locales\`("version_meta_title", "version_meta_image_id", "version_meta_description", "id", "_locale", "_parent_id") SELECT "version_meta_title", "version_meta_image_id", "version_meta_description", "id", "_locale", "_parent_id" FROM \`_pages_v_locales\`;`)
  await safeRun(db, sql`DROP TABLE \`_pages_v_locales\`;`)
  await safeRun(db, sql`ALTER TABLE \`__new__pages_v_locales\` RENAME TO \`_pages_v_locales\`;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await safeRun(db, sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await safeRun(db, sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`users_id\` integer,
  	\`redirects_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`search_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await safeRun(db, sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id", "media_id", "categories_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id", "media_id", "categories_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id" FROM \`payload_locked_documents_rels\`;`)
  await safeRun(db, sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await safeRun(db, sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
  await safeRun(db, sql`DROP INDEX \`pages_hero_links_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_hero_links\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_cta_links_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_cta_links\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_cta_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_cta\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_content_columns_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_content_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_content\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_media_block_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_media_block\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_archive_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_archive\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_blocks_form_block_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages_blocks_form_block\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_locale_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_pages_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_posts_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`pages_rels_categories_id_idx\`;`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_posts_id_idx\` ON \`pages_rels\` (\`posts_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`);`)
  await safeRun(db, sql`ALTER TABLE \`pages_rels\` DROP COLUMN \`locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_version_hero_links_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_version_hero_links\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_cta_links_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_cta_links\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_cta_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_cta\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_content_columns_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_content_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_content\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_media_block_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_media_block\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_archive_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_archive\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_blocks_form_block_locale_idx\`;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_blocks_form_block\` DROP COLUMN \`_locale\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_locale_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_pages_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_posts_id_idx\`;`)
  await safeRun(db, sql`DROP INDEX \`_pages_v_rels_categories_id_idx\`;`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_posts_id_idx\` ON \`_pages_v_rels\` (\`posts_id\`);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v_rels\` DROP COLUMN \`locale\`;`)
  await safeRun(db, sql`ALTER TABLE \`pages\` ADD \`title\` text;`)
  await safeRun(db, sql`ALTER TABLE \`pages\` ADD \`hero_type\` text DEFAULT 'lowImpact';`)
  await safeRun(db, sql`ALTER TABLE \`pages\` ADD \`hero_rich_text\` text;`)
  await safeRun(db, sql`ALTER TABLE \`pages\` ADD \`hero_media_id\` integer REFERENCES media(id);`)
  await safeRun(db, sql`CREATE INDEX \`pages_hero_hero_media_idx\` ON \`pages\` (\`hero_media_id\`);`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v\` ADD \`version_title\` text;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_type\` text DEFAULT 'lowImpact';`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_rich_text\` text;`)
  await safeRun(db, sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_media_id\` integer REFERENCES media(id);`)
  await safeRun(db, sql`CREATE INDEX \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v\` (\`version_hero_media_id\`);`)
  await safeRun(db, sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
