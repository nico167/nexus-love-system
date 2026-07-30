import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type UserRole = "admin" | "vip";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  vip: "VIP User",
};

export function prismaRoleToAppRole(role: Role): UserRole {
  return role === Role.ADMIN ? "admin" : "vip";
}

export function appRoleToPrismaRole(role: UserRole): Role {
  return role === "admin" ? Role.ADMIN : Role.VIP;
}

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role === "admin";
}

export function isVip(role: UserRole | undefined): boolean {
  return role === "vip";
}

export function canAccessAdminFeatures(role: UserRole | undefined): boolean {
  return isAdmin(role);
}
