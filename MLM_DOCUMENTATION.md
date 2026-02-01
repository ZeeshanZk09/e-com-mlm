# MLM System Documentation

## Overview

The MLM (Multi-Level Marketing) system is a comprehensive referral and commission management module integrated into Resellify. It enables users to earn commissions by referring new members and from sales made by their downline network.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# MLM System Configuration
# These values can also be configured via the Admin Panel

# Base URL for referral links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema

The MLM system adds the following models to the Prisma schema:

### User Model Extensions

- `sponsorId` - Unique referral code for each user
- `hierarchy` - Path string representing upline chain (e.g., "userId1.userId2.userId3")
- `mlmLevel` - User's rank/level in the MLM system
- `uplineId` - ID of the user's direct sponsor
- `isMLMEnabled` - Whether user participates in MLM

### New Models

- **Wallet** - Stores user's MLM earnings and balance
- **Commission** - Records of all commission transactions
- **Withdrawal** - Withdrawal requests and their status
- **CommissionRule** - Configurable commission rates per level/type
- **MLMSettings** - Global MLM configuration

## API Endpoints

### Public APIs (Authenticated Users)

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/api/mlm/tree`          | Get user's downline tree        |
| GET    | `/api/mlm/commissions`   | Get user's commission history   |
| GET    | `/api/mlm/wallet`        | Get wallet balance and summary  |
| POST   | `/api/mlm/withdraw`      | Request withdrawal              |
| GET    | `/api/mlm/withdrawals`   | Get withdrawal history          |
| GET    | `/api/mlm/rank`          | Get user's rank and performance |
| GET    | `/api/mlm/referral-link` | Get personalized referral link  |

### Admin APIs

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/api/admin/mlm/members`     | List all MLM members           |
| GET    | `/api/admin/mlm/commissions` | View all commissions           |
| PUT    | `/api/admin/mlm/commissions` | Approve/cancel commissions     |
| GET    | `/api/admin/mlm/withdrawals` | View withdrawal requests       |
| PUT    | `/api/admin/mlm/withdrawals` | Approve/reject/pay withdrawals |
| GET    | `/api/admin/mlm/rules`       | Get commission rules           |
| POST   | `/api/admin/mlm/rules`       | Create commission rule         |
| PUT    | `/api/admin/mlm/rules`       | Update commission rule         |
| DELETE | `/api/admin/mlm/rules`       | Delete commission rule         |
| GET    | `/api/admin/mlm/settings`    | Get MLM settings               |
| PUT    | `/api/admin/mlm/settings`    | Update MLM settings            |
| GET    | `/api/admin/mlm/analytics`   | Get MLM analytics              |

## User Registration Flow

When a new user registers with a referral/sponsor code:

1. User submits registration with optional `sponsorCode`
2. System validates the sponsor code exists and is active
3. A unique `sponsorId` is generated for the new user
4. Hierarchy path is built from the sponsor's hierarchy
5. A wallet is created for the new user
6. Signup bonus is processed if configured

## Commission Calculation

### Order Commissions

When an order is confirmed/delivered:

1. System retrieves order details and buyer's upline
2. Commission rules are applied based on level (1-5+ levels)
3. Commission records are created for each upline member
4. Wallet balances are updated (pending or approved based on settings)

### Signup Bonuses

When a new user registers with a sponsor:

1. Signup bonus rules are retrieved
2. Bonuses are distributed to sponsor and upline
3. Commission records are created

## Commission Types

- **SALE** - Commission from sales made by downline
- **SIGNUP** - Bonus for referring new members
- **LEVEL_UP** - Bonus for achieving new ranks
- **BONUS** - General/promotional bonuses

## Commission Status Flow

```
PENDING → APPROVED → PAID
    ↓
CANCELLED
```

## Withdrawal Status Flow

```
PENDING → APPROVED → PAID
    ↓         ↓
REJECTED  REJECTED
```

## Admin Panel Features

### MLM Overview Dashboard

- Total members count
- Commission statistics
- Pending withdrawals
- Top earners list
- Monthly trends

### Members Management

- View all MLM members
- Search by name/email/sponsor ID
- Toggle MLM status per user
- View member statistics

### Commission Management

- View all commissions
- Filter by type/status
- Approve pending commissions
- Cancel commissions
- Export to CSV

### Withdrawal Management

- View all withdrawal requests
- Approve/reject requests
- Mark as paid
- Add rejection notes
- Export to CSV

### Settings & Rules

- Global MLM toggle
- Max commission levels (1-10)
- Minimum withdrawal amount
- Withdrawal fee percentage
- Default signup bonus
- Auto-approve commissions toggle
- Commission rules editor

## User Dashboard Features

### MLM Dashboard

- Wallet balance display
- Total earnings summary
- Team size statistics
- Current rank
- Referral link with copy/share

### Team Tree Viewer

- Interactive tree visualization
- Adjustable depth (1-5 levels)
- Member details display
- Sales statistics per member

### Commission History

- Filterable table by type/status
- Summary cards
- Export to CSV
- Pagination

### Wallet & Withdrawals

- Balance display
- Request withdrawal form
- Payment method selection
- Withdrawal history

## Commission Rules Configuration

Default commission percentages by level:

- Level 1 (Direct): 10%
- Level 2: 5%
- Level 3: 3%
- Level 4: 2%
- Level 5: 1%

Rules can be customized via Admin Panel with:

- Custom percentages per level
- Fixed amount options
- Minimum order value requirements
- Maximum commission caps
- Priority ordering

## Integration with Orders

The MLM system integrates with the order flow:

1. User places order → Order created
2. Order status changes to CONFIRMED/DELIVERED/SHIPPED
3. `processOrderCommissions(orderId)` is triggered
4. Commissions calculated and distributed to upline

To integrate with your order processing:

```typescript
import { processOrderCommissions } from '@/shared/lib/services/mlm';

// After order confirmation
await processOrderCommissions(orderId);
```

## Security Considerations

- Sponsor code validation prevents invalid referrals
- Circular reference detection prevents hierarchy loops
- Commission calculations are server-side only
- Admin authorization required for management endpoints
- Audit trail maintained for all transactions

## Troubleshooting

### Hierarchy Rebuild

If hierarchy data becomes corrupted, use the admin maintenance function:

```typescript
import { rebuildHierarchyPaths } from '@/shared/lib/services/mlm';

await rebuildHierarchyPaths();
```

### Missing Wallet

Wallets are auto-created on registration. For existing users:

```typescript
import { getOrCreateWallet } from '@/shared/lib/services/mlm';

await getOrCreateWallet(userId);
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── mlm/
│   │   │   ├── tree/route.ts
│   │   │   ├── commissions/route.ts
│   │   │   ├── wallet/route.ts
│   │   │   ├── withdraw/route.ts
│   │   │   ├── withdrawals/route.ts
│   │   │   ├── rank/route.ts
│   │   │   └── referral-link/route.ts
│   │   └── admin/mlm/
│   │       ├── members/route.ts
│   │       ├── commissions/route.ts
│   │       ├── withdrawals/route.ts
│   │       ├── rules/route.ts
│   │       ├── settings/route.ts
│   │       └── analytics/route.ts
│   ├── admin/mlm/
│   │   ├── page.tsx (Dashboard)
│   │   ├── members/page.tsx
│   │   ├── commissions/page.tsx
│   │   ├── withdrawals/page.tsx
│   │   └── settings/page.tsx
│   └── dashboard/mlm/
│       ├── page.tsx (User Dashboard)
│       ├── team/page.tsx
│       ├── commissions/page.tsx
│       └── wallet/page.tsx
├── shared/
│   ├── components/
│   │   ├── mlm/
│   │   │   ├── MLMDashboard.tsx
│   │   │   ├── TreeViewer.tsx
│   │   │   ├── CommissionTable.tsx
│   │   │   ├── Wallet.tsx
│   │   │   └── index.ts
│   │   └── admin/mlm/
│   │       └── MembersTable.tsx
│   └── lib/services/mlm/
│       ├── index.ts
│       ├── hierarchyManager.ts
│       ├── commissionCalculator.ts
│       └── walletService.ts
└── types/
    └── mlm.ts
```
