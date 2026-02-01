// GET & PUT /api/admin/mlm/rules - Manage commission rules
import { Decimal } from '@prisma/client/runtime/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import type { CommissionType } from '@/shared/lib/generated/prisma/enums';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await prisma.commissionRule.findMany({
      orderBy: [{ type: 'asc' }, { level: 'asc' }],
    });

    // Group rules by type
    const rulesByType = rules.reduce(
      (acc, rule) => {
        if (!acc[rule.type]) {
          acc[rule.type] = [];
        }
        acc[rule.type].push(rule);
        return acc;
      },
      {} as Record<string, typeof rules>
    );

    return NextResponse.json({
      rules,
      rulesByType,
    });
  } catch (error) {
    console.error('Error fetching commission rules:', error);
    return NextResponse.json({ error: 'Failed to fetch commission rules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      level,
      percentage,
      fixedAmount,
      minOrderValue,
      maxCommission,
      isActive,
      priority,
    } = body;

    if (!name || !type || !level || percentage === undefined) {
      return NextResponse.json(
        { error: 'Name, type, level, and percentage are required' },
        { status: 400 }
      );
    }

    // Check if rule already exists for this type and level
    const existing = await prisma.commissionRule.findUnique({
      where: { type_level: { type, level } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A rule for this type and level already exists' },
        { status: 400 }
      );
    }

    const rule = await prisma.commissionRule.create({
      data: {
        name,
        type: type as CommissionType,
        level,
        percentage: new Decimal(percentage),
        fixedAmount: fixedAmount ? new Decimal(fixedAmount) : null,
        minOrderValue: minOrderValue ? new Decimal(minOrderValue) : null,
        maxCommission: maxCommission ? new Decimal(maxCommission) : null,
        isActive: isActive ?? true,
        priority: priority ?? 0,
      },
    });

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('Error creating commission rule:', error);
    return NextResponse.json({ error: 'Failed to create commission rule' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, percentage, fixedAmount, minOrderValue, maxCommission, isActive, priority } =
      body;

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (percentage !== undefined) updateData.percentage = new Decimal(percentage);
    if (fixedAmount !== undefined)
      updateData.fixedAmount = fixedAmount ? new Decimal(fixedAmount) : null;
    if (minOrderValue !== undefined)
      updateData.minOrderValue = minOrderValue ? new Decimal(minOrderValue) : null;
    if (maxCommission !== undefined)
      updateData.maxCommission = maxCommission ? new Decimal(maxCommission) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (priority !== undefined) updateData.priority = priority;

    const rule = await prisma.commissionRule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('Error updating commission rule:', error);
    return NextResponse.json({ error: 'Failed to update commission rule' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    await prisma.commissionRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting commission rule:', error);
    return NextResponse.json({ error: 'Failed to delete commission rule' }, { status: 500 });
  }
}
