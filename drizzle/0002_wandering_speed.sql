CREATE TABLE `potwCompetitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` varchar(64) NOT NULL,
	`title` varchar(128) NOT NULL,
	`status` enum('active','ended') NOT NULL DEFAULT 'active',
	`points` int NOT NULL DEFAULT 15,
	`yearLabel` varchar(32),
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`endedBy` int,
	CONSTRAINT `potwCompetitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `potwEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competitionId` int NOT NULL,
	`userId` int NOT NULL,
	`chosenOption` varchar(128) NOT NULL,
	`correct` boolean NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `potwEntries_id` PRIMARY KEY(`id`)
);
