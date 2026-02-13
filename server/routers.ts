import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  listAgendas,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  listDispositions,
  getDispositionById,
  createDisposition,
  updateDisposition,
  deleteDisposition,
  listDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
  listNotifications,
  createNotification,
  markNotificationAsRead,
  getDashboardStats,
  createAuditLog,
  getAuditLogs,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard Router
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return getDashboardStats();
    }),
  }),

  // Agendas Router
  agendas: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return listAgendas(input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const agenda = await getAgendaById(input);
        if (!agenda) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Agenda not found" });
        }
        return agenda;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          eventDate: z.date(),
          eventLocation: z.string().optional(),
          eventType: z.enum(["meeting", "ceremony", "conference", "workshop", "other"]).optional(),
          organizer: z.string().min(1),
          attendees: z.array(z.string()).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const agenda = await createAgenda({
          ...input,
          attendees: input.attendees ? JSON.stringify(input.attendees) : null,
          createdById: ctx.user!.id,
          status: "draft",
        });

        await createAuditLog({
          userId: ctx.user!.id,
          action: "create",
          entityType: "agenda",
          entityId: 0,
          changes: JSON.stringify(input),
        });

        return agenda;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          eventDate: z.date().optional(),
          eventLocation: z.string().optional(),
          eventType: z.enum(["meeting", "ceremony", "conference", "workshop", "other"]).optional(),
          organizer: z.string().optional(),
          attendees: z.array(z.string()).optional(),
          status: z.enum(["draft", "scheduled", "ongoing", "completed", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const agenda = await getAgendaById(id);
        if (!agenda) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Agenda not found" });
        }

        const updateData: any = {
          ...data,
          updatedById: ctx.user!.id,
        };

        if (data.attendees) {
          updateData.attendees = JSON.stringify(data.attendees);
        }

        await updateAgenda(id, updateData);

        await createAuditLog({
          userId: ctx.user!.id,
          action: "update",
          entityType: "agenda",
          entityId: id,
          changes: JSON.stringify({ before: agenda, after: updateData }),
        });

        return getAgendaById(id);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        const agenda = await getAgendaById(input);
        if (!agenda) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Agenda not found" });
        }

        await deleteAgenda(input);

        await createAuditLog({
          userId: ctx.user!.id,
          action: "delete",
          entityType: "agenda",
          entityId: input,
          changes: JSON.stringify(agenda),
        });

        return { success: true };
      }),
  }),

  // Dispositions Router
  dispositions: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return listDispositions(input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const disposition = await getDispositionById(input);
        if (!disposition) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Disposition not found" });
        }
        return disposition;
      }),

    create: protectedProcedure
      .input(
        z.object({
          agendaId: z.number(),
          documentTitle: z.string().min(1),
          documentNumber: z.string().optional(),
          description: z.string().optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          assignedTo: z.number().optional(),
          approvalRequired: z.boolean().optional(),
          dueDate: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const disposition = await createDisposition({
          ...input,
          createdById: ctx.user!.id,
          status: "pending",
        });

        await createAuditLog({
          userId: ctx.user!.id,
          action: "create",
          entityType: "disposition",
          entityId: 0,
          changes: JSON.stringify(input),
        });

        return disposition;
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "in_review", "approved", "rejected", "completed"]),
          approvalNotes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, status, approvalNotes } = input;
        const disposition = await getDispositionById(id);
        if (!disposition) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Disposition not found" });
        }

        const updateData: any = {
          status,
          approvalNotes,
        };

        if (status === "approved") {
          updateData.approvedBy = ctx.user!.id;
          updateData.approvalDate = new Date();
        }

        if (status === "completed") {
          updateData.completionDate = new Date();
        }

        await updateDisposition(id, updateData);

        await createAuditLog({
          userId: ctx.user!.id,
          action: "update_status",
          entityType: "disposition",
          entityId: id,
          changes: JSON.stringify({ status, approvalNotes }),
        });

        return getDispositionById(id);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        const disposition = await getDispositionById(input);
        if (!disposition) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Disposition not found" });
        }

        await deleteDisposition(input);

        await createAuditLog({
          userId: ctx.user!.id,
          action: "delete",
          entityType: "disposition",
          entityId: input,
          changes: JSON.stringify(disposition),
        });

        return { success: true };
      }),
  }),

  // Documents Router
  documents: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return listDocuments(input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const document = await getDocumentById(input);
        if (!document) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        }
        return document;
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        const document = await getDocumentById(input);
        if (!document) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        }

        await deleteDocument(input);

        await createAuditLog({
          userId: ctx.user!.id,
          action: "delete",
          entityType: "document",
          entityId: input,
          changes: JSON.stringify(document),
        });

        return { success: true };
      }),
  }),

  // Notifications Router
  notifications: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        return listNotifications(ctx.user!.id, input.limit, input.offset);
      }),

    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
