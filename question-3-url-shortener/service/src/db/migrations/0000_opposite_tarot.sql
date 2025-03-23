CREATE TABLE `lookup_urls` (
	`id` text PRIMARY KEY NOT NULL,
	`original_url` text NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text,
	`last_visit` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `original_url_idx` ON `lookup_urls` (`original_url`);