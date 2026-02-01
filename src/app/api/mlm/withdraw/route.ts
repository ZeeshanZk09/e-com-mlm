// POST /api/mlm/withdraw - Request a withdrawal
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requestWithdrawal } from '@/shared/lib/services/mlm';
import type { WithdrawalMethod } from '@/shared/lib/generated/prisma/enums';

interface WithdrawRequestBody {
  amount: number;
  method: WithdrawalMethod;
  details: {
    accountTitle?: string;
    accountNumber?: string;
    bankName?: string;
    branchCode?: string;
    walletNumber?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
  };
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: WithdrawRequestBody = await request.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
    }

    if (!body.method) {
      return NextResponse.json({ error: 'Withdrawal method is required' }, { status: 400 });
    }

    // Validate method-specific details
    switch (body.method) {
      case 'BANK':
        if (
          !body.details?.accountNumber ||
          !body.details?.bankName ||
          !body.details?.accountTitle
        ) {
          return NextResponse.json({ error: 'Bank account details are required' }, { status: 400 });
        }
        break;
      case 'EASYPAISA':
      case 'JAZZCASH':
        if (!body.details?.walletNumber) {
          return NextResponse.json({ error: 'Mobile wallet number is required' }, { status: 400 });
        }
        break;
      case 'CRYPTO':
        if (!body.details?.cryptoAddress || !body.details?.cryptoNetwork) {
          return NextResponse.json(
            { error: 'Crypto wallet address and network are required' },
            { status: 400 }
          );
        }
        break;
    }

    const result = await requestWithdrawal(session.user.id, {
      amount: body.amount,
      method: body.method,
      details: body.details,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      withdrawalId: result.withdrawalId,
      message: 'Withdrawal request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json({ error: 'Failed to create withdrawal request' }, { status: 500 });
  }
}
