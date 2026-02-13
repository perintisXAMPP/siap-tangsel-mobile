import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  department: varchar("department", { length: 255 }),
  position: varchar("position", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Agendas table - Menyimpan data agenda protokoler
 */
export const agendas = mysqlTable("agendas", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("eventDate").notNull(),
  eventLocation: varchar("eventLocation", { length: 255 }),
  eventType: mysqlEnum("eventType", [
    "meeting",
    "ceremony",
    "conference",
    "workshop",
    "other",
  ]).default("meeting"),
  status: mysqlEnum("status", [
    "draft",
    "scheduled",
    "ongoing",
    "completed",
    "cancelled",
  ]).default("draft"),
  organizer: varchar("organizer", { length: 255 }).notNull(),
  attendees: json("attendees"), // Array of user IDs or names
  notes: text("notes"),
  createdById: int("createdById").notNull(),
  updatedById: int("updatedById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agenda = typeof agendas.$inferSelect;
export type InsertAgenda = typeof agendas.$inferInsert;

/**
 * Dispositions table - Menyimpan data disposisi dokumen dengan approval workflow
 */
export const dispositions = mysqlTable("dispositions", {
  id: int("id").autoincrement().primaryKey(),
  agendaId: int("agendaId").notNull(),
  documentTitle: varchar("documentTitle", { length: 255 }).notNull(),
  documentNumber: varchar("documentNumber", { length: 100 }),
  description: text("description"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default(
    "medium"
  ),
  status: mysqlEnum("status", [
    "pending",
    "in_review",
    "approved",
    "rejected",
    "completed",
  ]).default("pending"),
  assignedTo: int("assignedTo"),
  approvalRequired: boolean("approvalRequired").default(true),
  approvedBy: int("approvedBy"),
  approvalDate: timestamp("approvalDate"),
  approvalNotes: text("approvalNotes"),
  dueDate: timestamp("dueDate"),
  completionDate: timestamp("completionDate"),
  createdById: int("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Disposition = typeof dispositions.$inferSelect;
export type InsertDisposition = typeof dispositions.$inferInsert;

/**
 * Documents table - Menyimpan metadata dokumen yang di-upload ke S3
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  agendaId: int("agendaId"),
  dispositionId: int("dispositionId"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 URL
  fileType: varchar("fileType", { length: 50 }), // MIME type
  fileSize: int("fileSize"), // Bytes
  documentType: mysqlEnum("documentType", [
    "invitation",
    "minutes",
    "photo",
    "report",
    "other",
  ]).default("other"),
  uploadedById: int("uploadedById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Notifications table - Menyimpan history notifikasi yang dikirim
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "agenda_created",
    "agenda_updated",
    "disposition_assigned",
    "disposition_approval_needed",
    "disposition_approved",
    "disposition_rejected",
    "document_uploaded",
    "system_alert",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  relatedAgendaId: int("relatedAgendaId"),
  relatedDispositionId: int("relatedDispositionId"),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  emailSent: boolean("emailSent").default(false),
  emailSentAt: timestamp("emailSentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Audit logs table - Menyimpan history semua perubahan untuk audit trail
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // create, update, delete, approve, etc
  entityType: varchar("entityType", { length: 50 }).notNull(), // agenda, disposition, document
  entityId: int("entityId").notNull(),
  changes: json("changes"), // Object with before/after values
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Relations untuk foreign keys
 */
export const agendaRelations = relations(agendas, ({ many }) => ({
  dispositions: many(dispositions),
  documents: many(documents),
}));

export const dispositionRelations = relations(dispositions, ({ one, many }) => ({
  agenda: one(agendas, {
    fields: [dispositions.agendaId],
    references: [agendas.id],
  }),
  documents: many(documents),
}));

export const documentRelations = relations(documents, ({ one }) => ({
  agenda: one(agendas, {
    fields: [documents.agendaId],
    references: [agendas.id],
  }),
  disposition: one(dispositions, {
    fields: [documents.dispositionId],
    references: [dispositions.id],
  }),
}));