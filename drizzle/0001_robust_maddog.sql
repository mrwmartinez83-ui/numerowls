CREATE TABLE `classMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teacherId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`yearGroup` int,
	`joinCode` varchar(8) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classes_id` PRIMARY KEY(`id`),
	CONSTRAINT `classes_joinCode_unique` UNIQUE(`joinCode`)
);
--> statement-breakpoint
CREATE TABLE `potwAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekKey` varchar(16) NOT NULL,
	`correct` boolean NOT NULL,
	`answeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `potwAnswers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `setWork` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teacherId` int NOT NULL,
	`classId` int NOT NULL,
	`title` varchar(128) NOT NULL,
	`description` text,
	`skillId` varchar(32),
	`testType` varchar(32) DEFAULT 'practice',
	`dueDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `setWork_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skillId` varchar(32) NOT NULL,
	`attempted` int NOT NULL DEFAULT 0,
	`correct` int NOT NULL DEFAULT 0,
	`bestScore` int NOT NULL DEFAULT 0,
	`lastAttemptAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skillProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testType` varchar(32) NOT NULL,
	`skillId` varchar(32),
	`yearGroup` int NOT NULL,
	`score` int NOT NULL,
	`total` int NOT NULL,
	`durationSeconds` int,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`certificateEarned` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeId` varchar(32) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBadges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','teacher') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `yearGroup` int;--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarEmoji` varchar(8) DEFAULT '🦉';--> statement-breakpoint
ALTER TABLE `users` ADD `totalPoints` int DEFAULT 0 NOT NULL;