CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone_number` text(20) NOT NULL,
	`email` text(255) NOT NULL,
	`address` text(255),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phone_number_unique` ON `contacts` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_email_unique` ON `contacts` (`email`);