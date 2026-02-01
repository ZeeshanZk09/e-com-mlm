'use client';

import { Check, HelpCircle, X } from 'lucide-react';

/**
 * Comparison Table Section
 *
 * Compares GO Shop MLM with:
 * - Traditional Retail Jobs
 * - Other MLM Companies
 */

type FeatureValue = boolean | string | { text: string; highlight?: boolean };

interface ComparisonFeature {
  feature: string;
  tooltip?: string;
  goShop: FeatureValue;
  traditionalRetail: FeatureValue;
  otherMLMs: FeatureValue;
}

const COMPARISON_DATA: ComparisonFeature[] = [
  {
    feature: 'Joining Fee',
    goShop: { text: 'FREE', highlight: true },
    traditionalRetail: { text: 'N/A' },
    otherMLMs: { text: '₹5,000 - ₹50,000' },
  },
  {
    feature: 'Monthly Mandatory Purchase',
    goShop: { text: 'None', highlight: true },
    traditionalRetail: { text: 'N/A' },
    otherMLMs: { text: '₹3,000 - ₹10,000' },
  },
  {
    feature: 'Product Quality',
    goShop: { text: 'Premium Verified', highlight: true },
    traditionalRetail: { text: 'Varies' },
    otherMLMs: { text: 'Often Low Quality' },
  },
  {
    feature: 'Commission Levels',
    goShop: { text: '5 Levels', highlight: true },
    traditionalRetail: { text: '0' },
    otherMLMs: { text: '2-3 Levels' },
  },
  {
    feature: 'Commission Rate',
    tooltip: 'Total commission across all levels',
    goShop: { text: 'Up to 21%', highlight: true },
    traditionalRetail: { text: '0%' },
    otherMLMs: { text: '5-10%' },
  },
  {
    feature: 'Payment Timeline',
    goShop: { text: 'Instant to Wallet', highlight: true },
    traditionalRetail: { text: 'Monthly Salary' },
    otherMLMs: { text: '30-60 Days' },
  },
  {
    feature: 'Withdrawal',
    goShop: { text: 'Weekly Available', highlight: true },
    traditionalRetail: { text: 'Monthly' },
    otherMLMs: { text: 'Monthly/Quarterly' },
  },
  {
    feature: 'Minimum Withdrawal',
    goShop: { text: '₹500', highlight: true },
    traditionalRetail: { text: 'N/A' },
    otherMLMs: { text: '₹2,000 - ₹5,000' },
  },
  {
    feature: 'Inventory Required',
    goShop: false,
    traditionalRetail: { text: 'Sometimes' },
    otherMLMs: true,
  },
  {
    feature: 'Training & Support',
    goShop: true,
    traditionalRetail: { text: 'Limited' },
    otherMLMs: { text: 'Paid' },
  },
  {
    feature: 'Dashboard & Analytics',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: { text: 'Basic' },
  },
  {
    feature: 'Mobile App Access',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: { text: 'Some' },
  },
  {
    feature: 'Transparent Tracking',
    tooltip: 'Real-time tracking of referrals and commissions',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: { text: 'Limited' },
  },
  {
    feature: 'Work from Anywhere',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: true,
  },
  {
    feature: 'Flexible Hours',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: true,
  },
  {
    feature: 'No Boss / Self-Employed',
    goShop: true,
    traditionalRetail: false,
    otherMLMs: true,
  },
];

function renderValue(value: FeatureValue): React.ReactNode {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className='w-5 h-5 text-[#7be08a] mx-auto' />
    ) : (
      <X className='w-5 h-5 text-destructive mx-auto' />
    );
  }

  if (typeof value === 'string') {
    return <span className='text-sm'>{value}</span>;
  }

  return (
    <span className={`text-sm ${value.highlight ? 'text-[#7be08a] font-semibold' : ''}`}>
      {value.text}
    </span>
  );
}

export function ComparisonTable() {
  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-card/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Why Choose <span className='text-[#7be08a]'>GO Shop MLM?</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            See how we compare to traditional jobs and other MLM companies
          </p>
        </div>

        {/* Comparison Table */}
        <div className='overflow-x-auto'>
          <div className='min-w-[600px]'>
            {/* Table Header */}
            <div className='grid grid-cols-4 gap-4 mb-4'>
              <div className='text-sm font-medium text-muted-foreground'>Feature</div>
              <div className='text-center'>
                <div className='inline-flex flex-col items-center gap-1'>
                  <div className='w-10 h-10 rounded-lg bg-linear-to-br from-[#0b6b2e] to-[#7be08a] flex items-center justify-center text-white font-bold'>
                    GO
                  </div>
                  <span className='text-sm font-semibold text-[#7be08a]'>GO Shop</span>
                </div>
              </div>
              <div className='text-center'>
                <div className='inline-flex flex-col items-center gap-1'>
                  <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs'>
                    9-5
                  </div>
                  <span className='text-sm font-medium'>Traditional</span>
                </div>
              </div>
              <div className='text-center'>
                <div className='inline-flex flex-col items-center gap-1'>
                  <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs'>
                    MLM
                  </div>
                  <span className='text-sm font-medium'>Other MLMs</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className='space-y-2'>
              {COMPARISON_DATA.map((row, index) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 gap-4 items-center py-3 px-4 rounded-lg transition-colors ${
                    index % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'
                  } hover:bg-muted/50`}
                >
                  {/* Feature Name */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>{row.feature}</span>
                    {row.tooltip && (
                      <div className='group relative'>
                        <HelpCircle className='w-4 h-4 text-muted-foreground cursor-help' />
                        <div className='absolute bottom-full left-0 mb-2 w-48 p-2 bg-card border border-border rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg'>
                          {row.tooltip}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GO Shop */}
                  <div className='text-center'>{renderValue(row.goShop)}</div>

                  {/* Traditional */}
                  <div className='text-center text-muted-foreground'>
                    {renderValue(row.traditionalRetail)}
                  </div>

                  {/* Other MLMs */}
                  <div className='text-center text-muted-foreground'>
                    {renderValue(row.otherMLMs)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className='mt-10 text-center'>
          <div className='inline-flex items-center gap-2 bg-[#7be08a]/10 text-[#7be08a] rounded-full px-6 py-3'>
            <Check className='w-5 h-5' />
            <span className='font-medium'>GO Shop offers the best value with zero risk</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonTable;
