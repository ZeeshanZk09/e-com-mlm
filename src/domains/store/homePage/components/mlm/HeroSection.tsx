'use client';

import { ArrowRight, Play, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * MLM Hero Section
 *
 * Features:
 * - Dual CTAs (Join MLM + Shop)
 * - Animated gradient background
 * - Live counters for trust signals
 * - Network visualization preview
 */

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className='tabular-nums'>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  level: number;
  connected: number[];
}

function NetworkVisualization() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useEffect(() => {
    // Generate network nodes
    const generatedNodes: NetworkNode[] = [
      { id: 0, x: 50, y: 15, level: 0, connected: [1, 2, 3] },
      { id: 1, x: 20, y: 35, level: 1, connected: [4, 5] },
      { id: 2, x: 50, y: 35, level: 1, connected: [6, 7] },
      { id: 3, x: 80, y: 35, level: 1, connected: [8, 9] },
      { id: 4, x: 10, y: 55, level: 2, connected: [10] },
      { id: 5, x: 30, y: 55, level: 2, connected: [11] },
      { id: 6, x: 40, y: 55, level: 2, connected: [] },
      { id: 7, x: 60, y: 55, level: 2, connected: [] },
      { id: 8, x: 70, y: 55, level: 2, connected: [12] },
      { id: 9, x: 90, y: 55, level: 2, connected: [] },
      { id: 10, x: 10, y: 75, level: 3, connected: [] },
      { id: 11, x: 30, y: 75, level: 3, connected: [] },
      { id: 12, x: 70, y: 75, level: 3, connected: [] },
    ];
    setNodes(generatedNodes);

    // Animate active node
    const interval = setInterval(() => {
      setActiveNode((prev) => {
        const next = prev === null ? 0 : (prev + 1) % generatedNodes.length;
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative w-full h-full min-h-[280px] sm:min-h-[350px]'>
      <svg className='w-full h-full' viewBox='0 0 100 90' preserveAspectRatio='xMidYMid meet'>
        <defs>
          <linearGradient id='nodeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#0b6b2e' />
            <stop offset='100%' stopColor='#7be08a' />
          </linearGradient>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='1' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {nodes.map((node) =>
          node.connected.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId);
            if (!target) return null;
            const isActive = activeNode === node.id || activeNode === targetId;
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                className={`transition-all duration-500 ${
                  isActive ? 'stroke-[#7be08a]' : 'stroke-muted-foreground/30'
                }`}
                strokeWidth={isActive ? 0.6 : 0.3}
                filter={isActive ? 'url(#glow)' : undefined}
              />
            );
          })
        )}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const size = node.level === 0 ? 4 : node.level === 1 ? 3 : 2.5;
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={size + (isActive ? 1 : 0)}
                className={`transition-all duration-300 ${
                  isActive ? 'fill-[#7be08a] animate-pulse' : 'fill-[#0b6b2e]'
                }`}
                filter={isActive ? 'url(#glow)' : undefined}
              />
              {node.level === 0 && (
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor='middle'
                  className='fill-white text-[3px] font-bold'
                >
                  YOU
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating earnings indicators */}
      <div className='absolute top-4 right-4 sm:top-6 sm:right-6 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border animate-bounce-in'>
        <p className='text-xs text-muted-foreground'>Level 1 Commission</p>
        <p className='text-lg font-bold text-[#7be08a]'>+₹500</p>
      </div>
      <div
        className='absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border animate-bounce-in'
        style={{ animationDelay: '0.3s' }}
      >
        <p className='text-xs text-muted-foreground'>Team Bonus</p>
        <p className='text-lg font-bold text-[#7be08a]'>+₹2,000</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className='relative overflow-hidden py-12 sm:py-16 lg:py-20'>
      {/* Animated gradient background */}
      <div className='absolute inset-0 bg-linear-to-br from-[#0b6b2e]/20 via-background to-[#7be08a]/10' />
      <div className='absolute inset-0 opacity-30'>
        <div className='absolute top-0 left-1/4 w-72 h-72 bg-[#0b6b2e]/30 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#7be08a]/20 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Left Content */}
          <div className='text-center lg:text-left space-y-6'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-[#0b6b2e]/10 border border-[#0b6b2e]/20 rounded-full px-4 py-1.5'>
              <Zap className='w-4 h-4 text-[#7be08a]' />
              <span className='text-sm font-medium text-[#7be08a]'>
                Pakistan&apos;s #1 MLM Shopping Network
              </span>
            </div>

            {/* Main Headline */}
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
              Turn Your Shopping into{' '}
              <span className='bg-linear-to-r from-[#0b6b2e] to-[#7be08a] bg-clip-text text-transparent'>
                Unlimited Earnings
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0'>
              Join GO Shop MLM Network – Shop quality products, refer friends, and earn up to 5
              levels of commissions. Start your financial freedom journey today!
            </p>

            {/* Trust Signals */}
            <div className='flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <Users className='w-5 h-5 text-[#7be08a]' />
                <span>
                  <AnimatedCounter end={50000} suffix='+' /> Members
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-[#7be08a]' />
                <span>
                  ₹<AnimatedCounter end={25000000} prefix='' suffix='' /> Paid
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Shield className='w-5 h-5 text-[#7be08a]' />
                <span>Secure System</span>
              </div>
            </div>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2'>
              <Button
                asChild
                size='lg'
                className='bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 hover:from-[#0b6b2e]/90 hover:to-[#0b6b2e]/70 text-white font-semibold px-6 sm:px-8 py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-[#0b6b2e]/25 transition-all hover:scale-105'
              >
                <Link href='/auth/signup?mlm=true'>
                  Join Free – Start Earning
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='border-2 font-semibold px-6 sm:px-8 py-6 text-base sm:text-lg rounded-xl transition-all hover:scale-105'
              >
                <Link href='/shop'>
                  <Play className='w-5 h-5 mr-2' />
                  Explore Products
                </Link>
              </Button>
            </div>

            {/* Quick Stats Row */}
            <div className='flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-center'>
              <div>
                <p className='text-2xl sm:text-3xl font-bold text-[#7be08a]'>0%</p>
                <p className='text-xs sm:text-sm text-muted-foreground'>Joining Fee</p>
              </div>
              <div className='w-px bg-border' />
              <div>
                <p className='text-2xl sm:text-3xl font-bold'>5</p>
                <p className='text-xs sm:text-sm text-muted-foreground'>Earning Levels</p>
              </div>
              <div className='w-px bg-border' />
              <div>
                <p className='text-2xl sm:text-3xl font-bold text-[#7be08a]'>Instant</p>
                <p className='text-xs sm:text-sm text-muted-foreground'>Wallet Credit</p>
              </div>
            </div>
          </div>

          {/* Right Content - Network Visualization */}
          <div className='hidden lg:block'>
            <div className='relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-4 sm:p-6'>
              <NetworkVisualization />
              <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#0b6b2e] to-[#7be08a] text-white text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full shadow-lg'>
                Watch Your Network Grow
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
