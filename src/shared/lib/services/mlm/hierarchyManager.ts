// MLM Hierarchy Manager Service
// Handles sponsor code generation, hierarchy building, and upline/downline queries

import prisma from '@/shared/lib/prisma';
import type { User } from '@/shared/lib/generated/prisma/client';
import type { DownlineNode } from '@/types/mlm';

/**
 * Generate a unique sponsor code for a user
 * Format: First 3 chars of name (uppercase) + random 5 chars
 */
export function generateSponsorCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${suffix}`;
}

/**
 * Generate a unique sponsor code, checking for collisions
 */
export async function generateUniqueSponsorCode(name: string): Promise<string> {
  let code = generateSponsorCode(name);
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await prisma.user.findUnique({
      where: { sponsorId: code },
    });
    if (!existing) {
      return code;
    }
    code = generateSponsorCode(name);
    attempts++;
  }

  // If we still have collisions, add timestamp
  return `${code}${Date.now().toString(36).slice(-3).toUpperCase()}`;
}

/**
 * Validate if a sponsor code exists and is active
 */
export async function validateSponsorCode(
  code: string
): Promise<{ valid: boolean; sponsor?: User; error?: string }> {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Sponsor code is required' };
  }

  const sponsor = await prisma.user.findUnique({
    where: { sponsorId: code.toUpperCase() },
  });

  if (!sponsor) {
    return { valid: false, error: 'Invalid sponsor code' };
  }

  if (!sponsor.isActive) {
    return { valid: false, error: 'Sponsor account is inactive' };
  }

  if (!sponsor.isMLMEnabled) {
    return { valid: false, error: 'Sponsor is not part of the MLM program' };
  }

  return { valid: true, sponsor };
}

/**
 * Build hierarchy path from a sponsor
 * Returns a dot-separated string of user IDs from root to sponsor
 */
export async function buildHierarchyPath(sponsorId: string): Promise<string> {
  const sponsor = await prisma.user.findUnique({
    where: { id: sponsorId },
    select: { id: true, hierarchy: true },
  });

  if (!sponsor) {
    return '';
  }

  if (sponsor.hierarchy) {
    return `${sponsor.hierarchy}.${sponsor.id}`;
  }

  return sponsor.id;
}

/**
 * Get upline users for a given user up to N levels
 */
export async function getUpline(userId: string, levels: number = 5): Promise<User[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hierarchy: true },
  });

  if (!user?.hierarchy) {
    return [];
  }

  // Hierarchy is stored as "id1.id2.id3" from root to immediate parent
  const uplineIds = user.hierarchy.split('.').filter(Boolean).reverse(); // Reverse to get closest first
  const limitedIds = uplineIds.slice(0, levels);

  if (limitedIds.length === 0) {
    return [];
  }

  const uplineUsers = await prisma.user.findMany({
    where: {
      id: { in: limitedIds },
      isMLMEnabled: true,
      isActive: true,
    },
  });

  // Sort by the order in hierarchy (closest first)
  return limitedIds
    .map((id) => uplineUsers.find((u) => u.id === id))
    .filter((u): u is User => u !== undefined);
}

/**
 * Get direct downline users for a given user
 */
export async function getDirectDownline(userId: string): Promise<User[]> {
  return prisma.user.findMany({
    where: {
      uplineId: userId,
      isMLMEnabled: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get downline tree structure recursively
 */
export async function getDownlineTree(
  userId: string,
  depth: number = 3,
  currentDepth: number = 0
): Promise<DownlineNode[]> {
  if (currentDepth >= depth) {
    return [];
  }

  const directDownline = await prisma.user.findMany({
    where: {
      uplineId: userId,
      isMLMEnabled: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      sponsorId: true,
      mlmLevel: true,
      isMLMEnabled: true,
      createdAt: true,
      _count: {
        select: { downline: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const nodes: DownlineNode[] = [];

  for (const user of directDownline) {
    // Get total sales for this user (sum of order totals)
    const salesAgg = await prisma.order.aggregate({
      where: {
        userId: user.id,
        status: { in: ['DELIVERED', 'SHIPPED'] },
      },
      _sum: { totalAmount: true },
    });

    const node: DownlineNode = {
      id: user.id,
      name: user.name,
      email: user.email,
      sponsorId: user.sponsorId,
      mlmLevel: user.mlmLevel,
      isMLMEnabled: user.isMLMEnabled,
      joinedAt: user.createdAt,
      totalSales: Number(salesAgg._sum.totalAmount || 0),
      directDownlineCount: user._count.downline,
    };

    // Recursively get children
    if (currentDepth + 1 < depth) {
      node.children = await getDownlineTree(user.id, depth, currentDepth + 1);
    }

    nodes.push(node);
  }

  return nodes;
}

/**
 * Count total downline (all levels) for a user
 */
export async function countTotalDownline(userId: string): Promise<number> {
  // Get all users who have this user in their hierarchy
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return 0;

  // Count users whose hierarchy contains this user's ID
  const count = await prisma.user.count({
    where: {
      OR: [{ uplineId: userId }, { hierarchy: { contains: userId } }],
      isMLMEnabled: true,
    },
  });

  return count;
}

/**
 * Rebuild hierarchy paths for all users (maintenance function)
 * Should be run if hierarchy data gets corrupted
 */
export async function rebuildHierarchyPaths(): Promise<{
  success: boolean;
  updated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let updated = 0;

  try {
    // Get all MLM users ordered by creation date
    const users = await prisma.user.findMany({
      where: { isMLMEnabled: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, uplineId: true },
    });

    for (const user of users) {
      try {
        if (user.uplineId) {
          const newHierarchy = await buildHierarchyPath(user.uplineId);
          await prisma.user.update({
            where: { id: user.id },
            data: { hierarchy: newHierarchy },
          });
          updated++;
        } else {
          // Clear hierarchy for users without upline
          await prisma.user.update({
            where: { id: user.id },
            data: { hierarchy: null },
          });
          updated++;
        }
      } catch (err) {
        errors.push(`Failed to update user ${user.id}: ${err}`);
      }
    }

    return { success: true, updated, errors };
  } catch (err) {
    return {
      success: false,
      updated,
      errors: [...errors, `Fatal error: ${err}`],
    };
  }
}

/**
 * Check if adding a sponsor would create a circular reference
 */
export async function wouldCreateCircularReference(
  userId: string,
  potentialSponsorId: string
): Promise<boolean> {
  // Check if the potential sponsor is in the user's downline
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return false;

  // Check if potential sponsor has this user in their hierarchy
  const potentialSponsor = await prisma.user.findUnique({
    where: { id: potentialSponsorId },
    select: { hierarchy: true, uplineId: true },
  });

  if (!potentialSponsor) return false;

  // If potential sponsor's hierarchy contains this user, it would be circular
  if (potentialSponsor.hierarchy?.includes(userId)) {
    return true;
  }

  // Also check if potential sponsor's upline is this user
  if (potentialSponsor.uplineId === userId) {
    return true;
  }

  return false;
}
