import { eq, desc, and, gte, lte, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  agendas,
  dispositions,
  documents,
  notifications,
  auditLogs,
  Agenda,
  Disposition,
  Document,
  Notification,
  AuditLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "department", "position", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ AGENDA QUERIES ============

export async function listAgendas(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(agendas)
    .orderBy(desc(agendas.eventDate))
    .limit(limit)
    .offset(offset);
}

export async function getAgendaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(agendas).where(eq(agendas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAgenda(
  data: Omit<typeof agendas.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(agendas).values(data);
  return result[0];
}

export async function updateAgenda(
  id: number,
  data: Partial<typeof agendas.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(agendas).set(data).where(eq(agendas.id, id));
  return getAgendaById(id);
}

export async function deleteAgenda(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(agendas).where(eq(agendas.id, id));
}

// ============ DISPOSITION QUERIES ============

export async function listDispositions(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(dispositions)
    .orderBy(desc(dispositions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getDispositionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(dispositions)
    .where(eq(dispositions.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDisposition(
  data: Omit<typeof dispositions.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(dispositions).values(data);
  return result[0];
}

export async function updateDisposition(
  id: number,
  data: Partial<typeof dispositions.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(dispositions).set(data).where(eq(dispositions.id, id));
  return getDispositionById(id);
}

export async function deleteDisposition(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(dispositions).where(eq(dispositions.id, id));
}

// ============ DOCUMENT QUERIES ============

export async function listDocuments(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(documents)
    .orderBy(desc(documents.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDocument(
  data: Omit<typeof documents.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(documents).values(data);
  return result[0];
}

export async function deleteDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(documents).where(eq(documents.id, id));
}

// ============ NOTIFICATION QUERIES ============

export async function listNotifications(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createNotification(
  data: Omit<typeof notifications.$inferInsert, "id" | "createdAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(data);
  return result[0];
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, id));
}

// ============ AUDIT LOG QUERIES ============

export async function createAuditLog(
  data: Omit<typeof auditLogs.$inferInsert, "id" | "createdAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(auditLogs).values(data);
}

export async function getAuditLogs(
  entityType: string,
  entityId: number,
  limit = 50
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(auditLogs)
    .where(
      and(
        eq(auditLogs.entityType, entityType),
        eq(auditLogs.entityId, entityId)
      )
    )
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

// ============ DASHBOARD STATISTICS ============

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get counts
  const totalAgendas = await db
    .select({ count: agendas.id })
    .from(agendas);
  const upcomingAgendas = await db
    .select({ count: agendas.id })
    .from(agendas)
    .where(gte(agendas.eventDate, now));
  const pendingDispositions = await db
    .select({ count: dispositions.id })
    .from(dispositions)
    .where(eq(dispositions.status, "pending"));
  const completedDispositions = await db
    .select({ count: dispositions.id })
    .from(dispositions)
    .where(eq(dispositions.status, "completed"));

  return {
    totalAgendas: totalAgendas[0]?.count || 0,
    upcomingAgendas: upcomingAgendas[0]?.count || 0,
    pendingDispositions: pendingDispositions[0]?.count || 0,
    completedDispositions: completedDispositions[0]?.count || 0,
  };
}
