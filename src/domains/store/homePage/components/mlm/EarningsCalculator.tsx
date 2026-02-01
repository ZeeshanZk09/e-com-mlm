'use client';

import { Calculator, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * Earnings Calculator Section
 *
 * Interactive calculator showing potential earnings based on:
 * - Monthly shopping amount
 * - Number of direct referrals
 * - Average referrals per person (team growth)
 */

// Commission rates by level
const COMMISSION_RATES = [
  { level: 1, rate: 10, name: 'Direct Referrals' },
  { level: 2, rate: 5, name: 'Level 2' },
  { level: 3, rate: 3, name: 'Level 3' },
  { level: 4, rate: 2, name: 'Level 4' },
  { level: 5, rate: 1, name: 'Level 5' },
];

// Rank thresholds
const RANKS = [
  { name: 'Starter', minTeam: 0, minEarnings: 0, color: '#94a3b8' },
  { name: 'Silver', minTeam: 10, minEarnings: 5000, color: '#9ca3af' },
  { name: 'Gold', minTeam: 50, minEarnings: 25000, color: '#eab308' },
  { name: 'Platinum', minTeam: 200, minEarnings: 100000, color: '#a855f7' },
  { name: 'Diamond', minTeam: 1000, minEarnings: 500000, color: '#3b82f6' },
];

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  info?: string;
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  info,
}: Readonly<SliderProps>) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>{label}</label>
          {info && (
            <div className='group relative'>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
              <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-card border border-border rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg'>
                {info}
              </div>
            </div>
          )}
        </div>
        <span className='text-lg font-semibold text-[#7be08a]'>
          {prefix}
          {value.toLocaleString('en-IN')}
          {suffix}
        </span>
      </div>
      <div className='relative'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className='w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-linear-to-br
            [&::-webkit-slider-thumb]:from-[#0b6b2e]
            [&::-webkit-slider-thumb]:to-[#7be08a]
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-[#0b6b2e]/30
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-linear-to-br
            [&::-moz-range-thumb]:from-[#0b6b2e]
            [&::-moz-range-thumb]:to-[#7be08a]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-grab'
          style={{
            background: `linear-gradient(to right, #0b6b2e ${percentage}%, hsl(var(--muted)) ${percentage}%)`,
          }}
          aria-label={label}
        />
      </div>
      <div className='flex justify-between text-xs text-muted-foreground'>
        <span>
          {prefix}
          {min.toLocaleString('en-IN')}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString('en-IN')}
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function EarningsCalculator() {
  const [monthlySpending, setMonthlySpending] = useState(5000);
  const [directReferrals, setDirectReferrals] = useState(10);
  const [avgReferralsPerPerson, setAvgReferralsPerPerson] = useState(3);

  const calculations = useMemo(() => {
    // Calculate team size at each level
    const teamByLevel = [
      directReferrals, // Level 1
      directReferrals * avgReferralsPerPerson, // Level 2
      directReferrals * Math.pow(avgReferralsPerPerson, 2), // Level 3
      directReferrals * Math.pow(avgReferralsPerPerson, 3), // Level 4
      directReferrals * Math.pow(avgReferralsPerPerson, 4), // Level 5
    ];

    // Calculate earnings at each level
    const earningsByLevel = teamByLevel.map((teamSize, index) => {
      const rate = COMMISSION_RATES[index].rate / 100;
      return Math.floor(teamSize * monthlySpending * rate);
    });

    const totalTeam = teamByLevel.reduce((a, b) => a + b, 0);
    const totalEarnings = earningsByLevel.reduce((a, b) => a + b, 0);

    // Determine rank
    let currentRank = RANKS[0];
    for (const rank of RANKS) {
      if (totalTeam >= rank.minTeam && totalEarnings >= rank.minEarnings) {
        currentRank = rank;
      }
    }

    return {
      teamByLevel,
      earningsByLevel,
      totalTeam,
      totalEarnings,
      currentRank,
      yearlyEarnings: totalEarnings * 12,
    };
  }, [monthlySpending, directReferrals, avgReferralsPerPerson]);

  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-card/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 bg-[#0b6b2e]/10 text-[#0b6b2e] dark:text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
            <Calculator className='w-4 h-4' />
            <span className='text-sm font-medium'>Earnings Calculator</span>
          </div>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Calculate Your <span className='text-[#7be08a]'>Earning Potential</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            See how much you could earn based on your network growth. Adjust the sliders to explore
            different scenarios.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
          {/* Sliders */}
          <div className='bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-8'>
            <Slider
              label='Avg. Monthly Spending per Person'
              value={monthlySpending}
              onChange={setMonthlySpending}
              min={1000}
              max={50000}
              step={1000}
              prefix='₹'
              info='Average amount each person in your network spends monthly'
            />

            <Slider
              label='Your Direct Referrals'
              value={directReferrals}
              onChange={setDirectReferrals}
              min={1}
              max={100}
              step={1}
              info='Number of people you directly refer to the platform'
            />

            <Slider
              label='Avg. Referrals per Person'
              value={avgReferralsPerPerson}
              onChange={setAvgReferralsPerPerson}
              min={1}
              max={10}
              step={1}
              info='How many people each member in your network refers on average'
            />

            {/* Commission Rates Info */}
            <div className='pt-4 border-t border-border'>
              <p className='text-sm font-medium mb-3'>Commission Rates by Level</p>
              <div className='flex flex-wrap gap-2'>
                {COMMISSION_RATES.map((rate) => (
                  <div
                    key={rate.level}
                    className='flex items-center gap-1 bg-muted/50 px-3 py-1.5 rounded-full text-sm'
                  >
                    <span className='text-muted-foreground'>L{rate.level}:</span>
                    <span className='font-semibold text-[#7be08a]'>{rate.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className='space-y-6'>
            {/* Total Earnings Card */}
            <div className='bg-linear-to-br from-[#0b6b2e] to-[#0b6b2e]/80 rounded-2xl p-6 sm:p-8 text-white'>
              <p className='text-sm opacity-80 mb-2'>Your Monthly Earnings Potential</p>
              <p className='text-4xl sm:text-5xl font-bold mb-4'>
                ₹{calculations.totalEarnings.toLocaleString('en-IN')}
              </p>
              <div className='flex items-center gap-4 text-sm'>
                <div>
                  <p className='opacity-80'>Yearly</p>
                  <p className='font-semibold'>
                    ₹{calculations.yearlyEarnings.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className='w-px h-8 bg-white/20' />
                <div>
                  <p className='opacity-80'>Team Size</p>
                  <p className='font-semibold'>
                    {calculations.totalTeam.toLocaleString('en-IN')} members
                  </p>
                </div>
                <div className='w-px h-8 bg-white/20' />
                <div>
                  <p className='opacity-80'>Your Rank</p>
                  <p className='font-semibold' style={{ color: calculations.currentRank.color }}>
                    {calculations.currentRank.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown by Level */}
            <div className='bg-card rounded-2xl border border-border p-6'>
              <p className='font-semibold mb-4'>Earnings Breakdown by Level</p>
              <div className='space-y-3'>
                {COMMISSION_RATES.map((rate, index) => {
                  const teamSize = calculations.teamByLevel[index];
                  const earnings = calculations.earningsByLevel[index];
                  const maxEarnings = Math.max(...calculations.earningsByLevel);
                  const percentage = maxEarnings > 0 ? (earnings / maxEarnings) * 100 : 0;

                  return (
                    <div key={rate.level} className='space-y-1'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          Level {rate.level} ({teamSize.toLocaleString('en-IN')} members ×{' '}
                          {rate.rate}%)
                        </span>
                        <span className='font-semibold'>₹{earnings.toLocaleString('en-IN')}</span>
                      </div>
                      <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-linear-to-r from-[#0b6b2e] to-[#7be08a] transition-all duration-500'
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className='text-center'>
              <Button
                asChild
                size='lg'
                className='bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#0b6b2e]/25'
              >
                <Link href='/auth/signup?mlm=true'>
                  Start Earning Now
                  <ChevronRight className='w-5 h-5 ml-2' />
                </Link>
              </Button>
              <p className='text-xs text-muted-foreground mt-3'>
                * Calculations are estimates based on average network performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EarningsCalculator;
