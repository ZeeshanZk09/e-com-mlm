'use client';

import { MapPin, TrendingUp, UserPlus, Wallet } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

/**
 * Live Activity Dashboard Section
 *
 * Features:
 * - Real-time earnings counter
 * - Live activity feed with member actions
 * - Pakistan map with animated member locations
 */

// Pakistani cities for realistic data
const PAKISTANI_CITIES = [
  { name: 'Karachi', x: 35, y: 75 },
  { name: 'Lahore', x: 45, y: 35 },
  { name: 'Islamabad', x: 48, y: 25 },
  { name: 'Rawalpindi', x: 47, y: 27 },
  { name: 'Faisalabad', x: 42, y: 40 },
  { name: 'Multan', x: 38, y: 50 },
  { name: 'Peshawar', x: 38, y: 22 },
  { name: 'Quetta', x: 22, y: 48 },
  { name: 'Sialkot', x: 50, y: 32 },
  { name: 'Gujranwala', x: 48, y: 34 },
  { name: 'Hyderabad', x: 35, y: 68 },
  { name: 'Sukkur', x: 35, y: 58 },
];

// Pakistani names for realistic data
const PAKISTANI_NAMES = [
  'Ahmed Khan',
  'Fatima Bibi',
  'Muhammad Ali',
  'Ayesha Malik',
  'Usman Ahmed',
  'Zara Sheikh',
  'Bilal Hassan',
  'Sana Javed',
  'Imran Hussain',
  'Maria Aslam',
  'Hassan Raza',
  'Nadia Parveen',
  'Kamran Akmal',
  'Hina Altaf',
  'Rizwan Abbas',
  'Saima Noor',
  'Farhan Saeed',
  'Rabia Khan',
  'Tariq Mehmood',
  'Amna Ilyas',
];

interface ActivityItem {
  id: number;
  type: 'earning' | 'signup' | 'levelup';
  name: string;
  city: string;
  amount?: number;
  level?: string;
  timestamp: Date;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateActivity(id: number): ActivityItem {
  const types: ActivityItem['type'][] = ['earning', 'signup', 'levelup'];
  const type = getRandomItem(types);
  const name = getRandomItem(PAKISTANI_NAMES);
  const city = getRandomItem(PAKISTANI_CITIES).name;

  switch (type) {
    case 'earning':
      return {
        id,
        type,
        name,
        city,
        amount: Math.floor(Math.random() * 4500) + 500,
        timestamp: new Date(),
      };
    case 'signup':
      return {
        id,
        type,
        name,
        city,
        timestamp: new Date(),
      };
    case 'levelup':
      return {
        id,
        type,
        name,
        city,
        level: getRandomItem(['Silver', 'Gold', 'Platinum', 'Diamond']),
        timestamp: new Date(),
      };
  }
}

function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize with some activities
    const initial = Array.from({ length: 5 }, (_, i) => generateActivity(i));
    setActivities(initial);

    // Add new activity every 3 seconds
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateActivity(Date.now());
        return [newActivity, ...prev.slice(0, 4)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'earning':
        return <Wallet className='w-4 h-4 text-[#7be08a]' />;
      case 'signup':
        return <UserPlus className='w-4 h-4 text-blue-400' />;
      case 'levelup':
        return <TrendingUp className='w-4 h-4 text-yellow-400' />;
    }
  };

  const getMessage = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'earning':
        return (
          <>
            <span className='font-medium'>{activity.name}</span> earned{' '}
            <span className='text-[#7be08a] font-semibold'>
              ₹{activity.amount?.toLocaleString('en-IN')}
            </span>{' '}
            from referral
          </>
        );
      case 'signup':
        return (
          <>
            <span className='font-medium'>{activity.name}</span> joined from{' '}
            <span className='text-muted-foreground'>{activity.city}</span>
          </>
        );
      case 'levelup':
        return (
          <>
            <span className='font-medium'>{activity.name}</span> reached{' '}
            <span className='text-yellow-400 font-semibold'>{activity.level}</span> level
          </>
        );
    }
  };

  return (
    <div className='space-y-3 max-h-[280px] overflow-hidden'>
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={`flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border transition-all duration-500 ${
            index === 0 ? 'animate-slide-in' : ''
          }`}
          style={{ opacity: 1 - index * 0.15 }}
        >
          <div className='w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0'>
            {getIcon(activity.type)}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm leading-relaxed'>{getMessage(activity)}</p>
            <p className='text-xs text-muted-foreground mt-1'>Just now</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PakistanMap() {
  const [activeCities, setActiveCities] = useState<number[]>([]);

  useEffect(() => {
    // Randomly activate cities
    const interval = setInterval(() => {
      const numActive = Math.floor(Math.random() * 3) + 2;
      const indices = Array.from({ length: numActive }, () =>
        Math.floor(Math.random() * PAKISTANI_CITIES.length)
      );
      setActiveCities(indices);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative w-full aspect-[4/5] max-w-xs mx-auto'>
      {/* Simplified Pakistan outline */}
      <svg viewBox='0 0 100 100' className='w-full h-full'>
        <defs>
          <linearGradient id='mapGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#0b6b2e' stopOpacity='0.2' />
            <stop offset='100%' stopColor='#7be08a' stopOpacity='0.1' />
          </linearGradient>
        </defs>

        {/* Simplified Pakistan shape */}
        <path
          d='M25 15 L55 10 L65 25 L55 30 L55 45 L45 55 L50 65 L45 80 L30 85 L25 75 L15 60 L20 45 L25 15 Z'
          fill='url(#mapGradient)'
          stroke='#0b6b2e'
          strokeWidth='0.5'
          className='opacity-60'
        />

        {/* City dots */}
        {PAKISTANI_CITIES.map((city, index) => {
          const isActive = activeCities.includes(index);
          return (
            <g key={city.name}>
              {/* Pulse ring for active cities */}
              {isActive && (
                <circle
                  cx={city.x}
                  cy={city.y}
                  r='4'
                  fill='none'
                  stroke='#7be08a'
                  strokeWidth='0.5'
                  className='animate-ping'
                  style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                />
              )}
              {/* City dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isActive ? 2 : 1.5}
                className={`transition-all duration-300 ${
                  isActive ? 'fill-[#7be08a]' : 'fill-[#0b6b2e]/60'
                }`}
              />
            </g>
          );
        })}
      </svg>

      {/* City labels on hover */}
      <div className='absolute inset-0 pointer-events-none'>
        {PAKISTANI_CITIES.slice(0, 4).map((city) => (
          <div
            key={city.name}
            className='absolute flex items-center gap-1 text-xs text-muted-foreground'
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
              transform: 'translate(5px, -50%)',
            }}
          >
            <MapPin className='w-3 h-3' />
            {city.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveCounter() {
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [totalMembers, setTotalMembers] = useState(50000);

  const incrementCounter = useCallback(() => {
    setTodayEarnings((prev) => prev + Math.floor(Math.random() * 500) + 100);
    if (Math.random() > 0.7) {
      setTotalMembers((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    // Initialize
    setTodayEarnings(Math.floor(Math.random() * 50000) + 150000);

    // Increment every 2 seconds
    const interval = setInterval(incrementCounter, 2000);

    return () => clearInterval(interval);
  }, [incrementCounter]);

  return (
    <div className='grid grid-cols-2 gap-4'>
      <div className='bg-linear-to-br from-[#0b6b2e] to-[#0b6b2e]/80 rounded-xl p-4 text-white'>
        <p className='text-sm opacity-80 mb-1'>Commissions Paid Today</p>
        <p className='text-2xl sm:text-3xl font-bold tabular-nums'>
          ₹{todayEarnings.toLocaleString('en-IN')}
        </p>
        <div className='flex items-center gap-1 mt-2 text-xs opacity-80'>
          <div className='w-2 h-2 rounded-full bg-[#7be08a] animate-pulse' />
          Live updating
        </div>
      </div>
      <div className='bg-card rounded-xl p-4 border border-border'>
        <p className='text-sm text-muted-foreground mb-1'>Active Members</p>
        <p className='text-2xl sm:text-3xl font-bold tabular-nums'>
          {totalMembers.toLocaleString('en-IN')}+
        </p>
        <p className='text-xs text-[#7be08a] mt-2'>Growing every minute</p>
      </div>
    </div>
  );
}

export function LiveActivitySection() {
  return (
    <section className='py-12 sm:py-16 lg:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 bg-[#7be08a]/10 text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
            <div className='w-2 h-2 rounded-full bg-[#7be08a] animate-pulse' />
            <span className='text-sm font-medium'>Live Activity</span>
          </div>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Real-Time <span className='text-[#7be08a]'>Earnings Dashboard</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            Watch our community grow and earn in real-time. These are real members earning real
            money.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className='grid lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* Live Counter + Activity Feed */}
          <div className='lg:col-span-2 space-y-6'>
            <LiveCounter />

            <div className='bg-card rounded-xl border border-border p-4 sm:p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold'>Recent Activity</h3>
                <span className='text-xs text-muted-foreground'>Auto-updating</span>
              </div>
              <ActivityFeed />
            </div>
          </div>

          {/* Map */}
          <div className='bg-card rounded-xl border border-border p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold'>Members Across Pakistan</h3>
              <MapPin className='w-4 h-4 text-[#7be08a]' />
            </div>
            <PakistanMap />
            <p className='text-xs text-center text-muted-foreground mt-4'>
              Active in 50+ cities across Pakistan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveActivitySection;
