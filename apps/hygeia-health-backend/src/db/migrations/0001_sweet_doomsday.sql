ALTER TABLE `users` RENAME COLUMN "login_type" TO "loginType";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
CREATE TABLE `authenticators` (
	`id` text PRIMARY KEY NOT NULL,
	`credentialID` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`userId` text NOT NULL,
	`transports` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `currentChallenge` text;