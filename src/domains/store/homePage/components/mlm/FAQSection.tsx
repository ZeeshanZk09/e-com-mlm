'use client';

import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * FAQ Section
 *
 * Addresses common MLM concerns with expandable accordions
 */

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'earnings' | 'operations' | 'trust';
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    category: 'trust',
    question: 'Is this a pyramid scheme?',
    answer:
      "Absolutely not! Pyramid schemes are illegal and focus only on recruitment with no real products. GO Shop is a legitimate e-commerce platform where:\n\n• We sell real, quality products that people actually want to buy\n• You can earn by shopping yourself, without recruiting anyone\n• Commission is based on actual product sales, not recruitment fees\n• There's no mandatory purchase requirement\n• We're registered and compliant with all business regulations\n\nThe MLM component is simply a referral rewards program that lets you earn commissions when your network makes purchases.",
  },
  {
    id: 2,
    category: 'general',
    question: 'How much do I need to invest to start?',
    answer:
      'Nothing! Joining GO Shop MLM program is completely FREE. Unlike other MLM companies that require:\n\n• No joining fee\n• No starter kit purchase\n• No monthly minimum purchase requirement\n• No hidden charges\n\nSimply sign up with your email and start sharing your referral link. You only invest when you want to buy products for yourself (at great prices!).',
  },
  {
    id: 3,
    category: 'earnings',
    question: 'When will I get my first payment?',
    answer:
      'Commission is credited to your wallet INSTANTLY when someone in your network makes a purchase. You can withdraw your earnings once you reach ₹500 minimum balance.\n\n• Withdrawal requests are processed within 2-3 business days\n• Payment methods: Bank Transfer, JazzCash, Easypaisa\n• No deductions or hidden fees on withdrawal',
  },
  {
    id: 4,
    category: 'earnings',
    question: 'How much can I realistically earn?',
    answer:
      "Your earnings depend on your network size and activity. Here's what our members typically earn:\n\n• Casual Members (10-20 referrals): ₹5,000 - ₹15,000/month\n• Active Members (50+ referrals): ₹25,000 - ₹50,000/month\n• Top Performers (200+ network): ₹1,00,000+/month\n\nUse our earnings calculator to see your potential based on realistic scenarios. Remember, these are real products people regularly need - toiletries, cosmetics, home essentials - so your network will keep purchasing!",
  },
  {
    id: 5,
    category: 'operations',
    question: 'Can I do this part-time?',
    answer:
      "Yes! Most of our successful members started part-time while keeping their regular jobs. Here's why it works:\n\n• Share your referral link on social media (5 minutes)\n• Our marketing materials are ready to use\n• Orders are shipped directly to customers - no inventory handling\n• Track everything from our mobile-friendly dashboard\n• Passive income from network purchases\n\nYou can spend as little as 30 minutes a day and still build a profitable network.",
  },
  {
    id: 6,
    category: 'operations',
    question: 'What products can I sell?',
    answer:
      'You\'re not "selling" anything - you\'re sharing your shopping link! GO Shop offers:\n\n• 5000+ quality products\n• Categories: Fashion, Beauty, Home & Kitchen, Electronics, Health & Wellness\n• All products are verified for quality\n• Competitive prices with regular discounts\n• Products people already buy regularly\n\nWhen anyone uses your link to shop these products, you earn commission. Simple!',
  },
  {
    id: 7,
    category: 'trust',
    question: 'How do I know my earnings are tracked correctly?',
    answer:
      'Complete transparency is our core value. Your dashboard shows:\n\n• Real-time tracking of all referral clicks\n• Every purchase in your network with timestamp\n• Commission breakdown by level\n• Detailed transaction history\n• Downloadable reports for your records\n\nYou can verify every rupee earned and trace it back to the exact purchase.',
  },
  {
    id: 8,
    category: 'general',
    question: 'What support is available?',
    answer:
      "We provide comprehensive support for all members:\n\n• Dedicated WhatsApp support group\n• Video tutorials and training materials\n• Weekly live Q&A sessions\n• Ready-made marketing content\n• Personal success manager for Gold+ members\n• Active community of 50,000+ members to learn from\n\nYou're never alone in this journey!",
  },
  {
    id: 9,
    category: 'earnings',
    question: 'What are the 5 commission levels?',
    answer:
      'You earn commission from 5 levels of your network:\n\n• Level 1 (Direct Referrals): 10% of purchase value\n• Level 2 (Their referrals): 5%\n• Level 3: 3%\n• Level 4: 2%\n• Level 5: 1%\n\nTotal potential commission: Up to 21% of all purchases in your 5-level network!',
  },
  {
    id: 10,
    category: 'operations',
    question: 'Do I need to handle shipping or customer service?',
    answer:
      'Not at all! GO Shop handles everything:\n\n• Product sourcing and quality control\n• Order processing and packaging\n• Shipping across Pakistan (free over ₹999)\n• Customer support for order issues\n• Returns and refunds\n\nYour only job is to share your link and watch your network grow!',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'Getting Started' },
  { id: 'earnings', label: 'Earnings & Payments' },
  { id: 'operations', label: 'How It Works' },
  { id: 'trust', label: 'Trust & Legitimacy' },
];

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className='border border-border rounded-xl overflow-hidden transition-all'>
      <button
        className={`w-full flex items-start gap-4 p-4 sm:p-5 text-left transition-colors ${
          isOpen ? 'bg-muted/50' : 'hover:bg-muted/30'
        }`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <HelpCircle
          className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${isOpen ? 'text-[#7be08a]' : 'text-muted-foreground'}`}
        />
        <span className='flex-1 font-medium text-sm sm:text-base'>{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#7be08a]' : 'text-muted-foreground'}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}
      >
        <div className='px-4 sm:px-5 pb-4 sm:pb-5 pl-12 sm:pl-14'>
          <div className='text-sm sm:text-base text-muted-foreground whitespace-pre-line leading-relaxed'>
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandAll, setExpandAll] = useState(false);

  const filteredFAQs =
    activeCategory === 'all' ? FAQ_DATA : FAQ_DATA.filter((faq) => faq.category === activeCategory);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
    setExpandAll(false);
  };

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setOpenId(null);
  };

  return (
    <section className='py-12 sm:py-16 lg:py-20'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 bg-[#0b6b2e]/10 text-[#0b6b2e] dark:text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
            <HelpCircle className='w-4 h-4' />
            <span className='text-sm font-medium'>FAQ</span>
          </div>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Frequently Asked <span className='text-[#7be08a]'>Questions</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg'>
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking
            for, reach out to us.
          </p>
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#0b6b2e] text-white'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Expand/Collapse All */}
        <div className='flex justify-end mb-4'>
          <button onClick={handleExpandAll} className='text-sm text-[#7be08a] hover:underline'>
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* FAQ List */}
        <div className='space-y-3'>
          {filteredFAQs.map((faq) => (
            <FAQAccordion
              key={faq.id}
              item={faq}
              isOpen={expandAll || openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className='mt-10 text-center bg-card rounded-2xl border border-border p-6 sm:p-8'>
          <MessageCircle className='w-10 h-10 mx-auto text-[#7be08a] mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Still Have Questions?</h3>
          <p className='text-muted-foreground text-sm mb-4'>
            Our support team is here to help you 24/7
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button asChild variant='outline'>
              <Link href='/contact'>Contact Support</Link>
            </Button>
            <Button asChild className='bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white'>
              <a href='https://wa.me/923001234567' target='_blank' rel='noopener noreferrer'>
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
