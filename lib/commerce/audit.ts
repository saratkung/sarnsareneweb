// ============================================================
// SARNSARENE — admin audit log (§29). Phase 4: AUDIT_LOGS table.
// ============================================================

import { prisma } from "@/lib/db";

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  targetType: "order" | "product" | "inventory" | "auth";
  targetId: string;
  summary: string;
};

const toEntry = (r: {
  id: string;
  at: Date;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  summary: string;
}): AuditEntry => ({
  id: r.id,
  at: r.at.toISOString(),
  actor: r.actor,
  action: r.action,
  targetType: r.targetType as AuditEntry["targetType"],
  targetId: r.targetId,
  summary: r.summary,
});

export async function logAudit(entry: Omit<AuditEntry, "id" | "at">): Promise<void> {
  await prisma.auditLog.create({ data: entry });
}

export async function listAudit(limit = 50): Promise<AuditEntry[]> {
  const rows = await prisma.auditLog.findMany({ orderBy: { at: "desc" }, take: limit });
  return rows.map(toEntry);
}

export async function listAuditFor(
  targetType: AuditEntry["targetType"],
  targetId: string,
  limit = 20,
): Promise<AuditEntry[]> {
  const rows = await prisma.auditLog.findMany({
    where: { targetType, targetId },
    orderBy: { at: "desc" },
    take: limit,
  });
  return rows.map(toEntry);
}
