DROP INDEX "contacts_phone_number_unique";--> statement-breakpoint
DROP INDEX "contacts_email_unique";--> statement-breakpoint
ALTER TABLE `contacts` ALTER COLUMN "is_favorite" TO "is_favorite" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phone_number_unique` ON `contacts` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_email_unique` ON `contacts` (`email`);