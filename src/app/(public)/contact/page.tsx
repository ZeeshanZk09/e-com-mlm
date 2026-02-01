'use client';

import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Contact Us</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Have a question or need help? We're here for you. Reach out and we'll respond as soon as
            we can.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Contact Info Cards */}
          <div className='space-y-4'>
            <Card>
              <CardContent className='flex items-start gap-4 p-6'>
                <div className='p-3 bg-primary/10 rounded-lg'>
                  <Phone className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Phone</h3>
                  <p className='text-muted-foreground text-sm mt-1'>+92 300 1234567</p>
                  <p className='text-muted-foreground text-sm'>Mon-Sat, 9am-6pm</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='flex items-start gap-4 p-6'>
                <div className='p-3 bg-primary/10 rounded-lg'>
                  <Mail className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Email</h3>
                  <p className='text-muted-foreground text-sm mt-1'>support@goshop.pk</p>
                  <p className='text-muted-foreground text-sm'>We reply within 24 hours</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='flex items-start gap-4 p-6'>
                <div className='p-3 bg-primary/10 rounded-lg'>
                  <MapPin className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Address</h3>
                  <p className='text-muted-foreground text-sm mt-1'>
                    123 Main Street, Gulberg III
                    <br />
                    Lahore, Pakistan
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='flex items-start gap-4 p-6'>
                <div className='p-3 bg-green-500/10 rounded-lg'>
                  <MessageCircle className='w-6 h-6 text-green-500' />
                </div>
                <div>
                  <h3 className='font-semibold'>WhatsApp</h3>
                  <p className='text-muted-foreground text-sm mt-1'>+92 300 1234567</p>
                  <a
                    href='https://wa.me/923001234567'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green-500 text-sm hover:underline'
                  >
                    Chat with us →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input
                        id='name'
                        placeholder='Your name'
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='your@email.com'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input
                      id='subject'
                      placeholder='What is this about?'
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea
                      id='message'
                      placeholder='Tell us more about your inquiry...'
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type='submit' disabled={loading} className='w-full sm:w-auto'>
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className='w-4 h-4 mr-2' />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
