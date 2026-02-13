CREATE TABLE `agendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`eventLocation` varchar(255),
	`eventType` enum('meeting','ceremony','conference','workshop','other') DEFAULT 'meeting',
	`status` enum('draft','scheduled','ongoing','completed','cancelled') DEFAULT 'draft',
	`organizer` varchar(255) NOT NULL,
	`attendees` json,
	`notes` text,
	`createdById` int NOT NULL,
	`updatedById` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`changes` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dispositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agendaId` int NOT NULL,
	`documentTitle` varchar(255) NOT NULL,
	`documentNumber` varchar(100),
	`description` text,
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`status` enum('pending','in_review','approved','rejected','completed') DEFAULT 'pending',
	`assignedTo` int,
	`approvalRequired` boolean DEFAULT true,
	`approvedBy` int,
	`approvalDate` timestamp,
	`approvalNotes` text,
	`dueDate` timestamp,
	`completionDate` timestamp,
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dispositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agendaId` int,
	`dispositionId` int,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileType` varchar(50),
	`fileSize` int,
	`documentType` enum('invitation','minutes','photo','report','other') DEFAULT 'other',
	`uploadedById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('agenda_created','agenda_updated','disposition_assigned','disposition_approval_needed','disposition_approved','disposition_rejected','document_uploaded','system_alert') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedAgendaId` int,
	`relatedDispositionId` int,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`emailSent` boolean DEFAULT false,
	`emailSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `position` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);