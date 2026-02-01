// GET & PUT /api/admin/mlm/settings - MLM global settings
import { Decimal } from '@prisma/client/runtime/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.mLMSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.mLMSettings.create({
        data: {
          isMLMEnabled: true,
          maxLevels: 5,
          minWithdrawal: new Decimal(500),
          withdrawalFeePercent: new Decimal(0),
          defaultSignupBonus: new Decimal(0),
          autoApproveCommissions: false,
          autoEnableMLM: true,
        },
      });
    }

    return NextResponse.json({
      id: settings.id,
      isMLMEnabled: settings.isMLMEnabled,
      maxLevels: settings.maxLevels,
      minWithdrawal: Number(settings.minWithdrawal),
      withdrawalFeePercent: Number(settings.withdrawalFeePercent),
      defaultSignupBonus: Number(settings.defaultSignupBonus),
      autoApproveCommissions: settings.autoApproveCommissions,
      autoEnableMLM: settings.autoEnableMLM,
    });
  } catch (error) {
    console.error('Error fetching MLM settings:', error);
    return NextResponse.json({ error: 'Failed to fetch MLM settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      isMLMEnabled,
      maxLevels,
      minWithdrawal,
      withdrawalFeePercent,
      defaultSignupBonus,
      autoApproveCommissions,
      autoEnableMLM,
    } = body;

    // Get existing settings or create
    let settings = await prisma.mLMSettings.findFirst();

    const updateData: any = {};

    if (typeof isMLMEnabled === 'boolean') updateData.isMLMEnabled = isMLMEnabled;
    if (typeof maxLevels === 'number' && maxLevels >= 1 && maxLevels <= 10) {
      updateData.maxLevels = maxLevels;
    }
    if (typeof minWithdrawal === 'number' && minWithdrawal >= 0) {
      updateData.minWithdrawal = new Decimal(minWithdrawal);
    }
    if (
      typeof withdrawalFeePercent === 'number' &&
      withdrawalFeePercent >= 0 &&
      withdrawalFeePercent <= 100
    ) {
      updateData.withdrawalFeePercent = new Decimal(withdrawalFeePercent);
    }
    if (typeof defaultSignupBonus === 'number' && defaultSignupBonus >= 0) {
      updateData.defaultSignupBonus = new Decimal(defaultSignupBonus);
    }
    if (typeof autoApproveCommissions === 'boolean') {
      updateData.autoApproveCommissions = autoApproveCommissions;
    }
    if (typeof autoEnableMLM === 'boolean') {
      updateData.autoEnableMLM = autoEnableMLM;
    }

    if (settings) {
      settings = await prisma.mLMSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.mLMSettings.create({
        data: {
          isMLMEnabled: updateData.isMLMEnabled ?? true,
          maxLevels: updateData.maxLevels ?? 5,
          minWithdrawal: updateData.minWithdrawal ?? new Decimal(500),
          withdrawalFeePercent: updateData.withdrawalFeePercent ?? new Decimal(0),
          defaultSignupBonus: updateData.defaultSignupBonus ?? new Decimal(0),
          autoApproveCommissions: updateData.autoApproveCommissions ?? false,
          autoEnableMLM: updateData.autoEnableMLM ?? true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        id: settings.id,
        isMLMEnabled: settings.isMLMEnabled,
        maxLevels: settings.maxLevels,
        minWithdrawal: Number(settings.minWithdrawal),
        withdrawalFeePercent: Number(settings.withdrawalFeePercent),
        defaultSignupBonus: Number(settings.defaultSignupBonus),
        autoApproveCommissions: settings.autoApproveCommissions,
        autoEnableMLM: settings.autoEnableMLM,
      },
    });
  } catch (error) {
    console.error('Error updating MLM settings:', error);
    return NextResponse.json({ error: 'Failed to update MLM settings' }, { status: 500 });
  }
}
