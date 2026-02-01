'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Settings, Save, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface MLMSettings {
  id: string;
  isMLMEnabled: boolean;
  maxLevels: number;
  minWithdrawal: number;
  withdrawalFeePercent: number;
  defaultSignupBonus: number;
  autoApproveCommissions: boolean;
  autoEnableMLM: boolean;
}

interface CommissionRule {
  id: string;
  name: string;
  type: 'SALE' | 'SIGNUP' | 'LEVEL_UP' | 'BONUS';
  level: number;
  percentage: string;
  fixedAmount: string | null;
  minOrderValue: string | null;
  maxCommission: string | null;
  isActive: boolean;
  priority: number;
}

const typeLabels: Record<string, string> = {
  SALE: 'Sales Commission',
  SIGNUP: 'Signup Bonus',
  LEVEL_UP: 'Level Up Bonus',
  BONUS: 'General Bonus',
};

const typeColors: Record<string, string> = {
  SALE: 'bg-purple-100 text-purple-800',
  SIGNUP: 'bg-green-100 text-green-800',
  LEVEL_UP: 'bg-blue-100 text-blue-800',
  BONUS: 'bg-orange-100 text-orange-800',
};

export default function AdminMLMSettingsPage() {
  const [settings, setSettings] = useState<MLMSettings | null>(null);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);

  // Form state for new/edit rule
  const [ruleForm, setRuleForm] = useState<{
    name: string;
    type: 'SALE' | 'SIGNUP' | 'LEVEL_UP' | 'BONUS';
    level: number;
    percentage: number;
    fixedAmount: string;
    minOrderValue: string;
    maxCommission: string;
    isActive: boolean;
    priority: number;
  }>({
    name: '',
    type: 'SALE',
    level: 1,
    percentage: 0,
    fixedAmount: '',
    minOrderValue: '',
    maxCommission: '',
    isActive: true,
    priority: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [settingsRes, rulesRes] = await Promise.all([
        fetch('/api/admin/mlm/settings'),
        fetch('/api/admin/mlm/rules'),
      ]);

      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        setRules(data.rules);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/mlm/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  function openNewRuleDialog() {
    setEditingRule(null);
    setRuleForm({
      name: '',
      type: 'SALE',
      level: 1,
      percentage: 0,
      fixedAmount: '',
      minOrderValue: '',
      maxCommission: '',
      isActive: true,
      priority: 0,
    });
    setRuleDialogOpen(true);
  }

  function openEditRuleDialog(rule: CommissionRule) {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      type: rule.type,
      level: rule.level,
      percentage: Number(rule.percentage),
      fixedAmount: rule.fixedAmount || '',
      minOrderValue: rule.minOrderValue || '',
      maxCommission: rule.maxCommission || '',
      isActive: rule.isActive,
      priority: rule.priority,
    });
    setRuleDialogOpen(true);
  }

  async function saveRule() {
    setSaving(true);
    try {
      const endpoint = '/api/admin/mlm/rules';
      const method = editingRule ? 'PUT' : 'POST';
      const body = editingRule ? { id: editingRule.id, ...ruleForm } : ruleForm;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingRule ? 'Rule updated successfully' : 'Rule created successfully');
        setRuleDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to save rule');
      }
    } catch (err) {
      console.error('Failed to save rule:', err);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function deleteRule(ruleId: string) {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const res = await fetch('/api/admin/mlm/rules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId }),
      });

      if (res.ok) {
        toast.success('Rule deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete rule');
      }
    } catch (err) {
      console.error('Failed to delete rule:', err);
      toast.error('Something went wrong');
    }
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>MLM Settings</h1>
        </div>
        <div className='animate-pulse space-y-4'>
          <Card className='p-6'>
            <div className='h-6 bg-gray-200 rounded w-1/4 mb-4' />
            <div className='space-y-3'>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={`skeleton-${n}`} className='h-10 bg-gray-100 rounded' />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Settings className='h-6 w-6 text-gray-600' />
            MLM Settings
          </h1>
          <p className='text-muted-foreground'>
            Configure MLM system settings and commission rules
          </p>
        </div>
      </div>

      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>General Settings</TabsTrigger>
          <TabsTrigger value='rules'>Commission Rules</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value='general'>
          <Card className='p-6'>
            <h2 className='text-lg font-semibold mb-6'>General MLM Settings</h2>

            {settings && (
              <div className='space-y-6'>
                {/* Toggle Settings */}
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <Label className='text-base font-medium'>Enable MLM System</Label>
                      <p className='text-sm text-muted-foreground'>
                        Master toggle for the entire MLM system
                      </p>
                    </div>
                    <Switch
                      checked={settings.isMLMEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, isMLMEnabled: checked })
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <Label className='text-base font-medium'>Auto-Enable MLM for New Users</Label>
                      <p className='text-sm text-muted-foreground'>
                        Automatically enroll new registrations in MLM
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoEnableMLM}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoEnableMLM: checked })
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <Label className='text-base font-medium'>Auto-Approve Commissions</Label>
                      <p className='text-sm text-muted-foreground'>
                        Automatically approve pending commissions
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoApproveCommissions}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoApproveCommissions: checked })
                      }
                    />
                  </div>
                </div>

                {/* Numeric Settings */}
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  <div>
                    <Label>Maximum Commission Levels</Label>
                    <Input
                      type='number'
                      min={1}
                      max={10}
                      value={settings.maxLevels}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxLevels: Number.parseInt(e.target.value) || 5,
                        })
                      }
                      className='mt-1'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>1-10 levels deep</p>
                  </div>

                  <div>
                    <Label>Minimum Withdrawal (Rs.)</Label>
                    <Input
                      type='number'
                      min={0}
                      value={settings.minWithdrawal}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minWithdrawal: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className='mt-1'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>Minimum amount to withdraw</p>
                  </div>

                  <div>
                    <Label>Withdrawal Fee (%)</Label>
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      step={0.1}
                      value={settings.withdrawalFeePercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          withdrawalFeePercent: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className='mt-1'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Fee deducted on withdrawals
                    </p>
                  </div>

                  <div>
                    <Label>Default Signup Bonus (Rs.)</Label>
                    <Input
                      type='number'
                      min={0}
                      value={settings.defaultSignupBonus}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultSignupBonus: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className='mt-1'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Bonus for referring new users
                    </p>
                  </div>
                </div>

                <div className='flex justify-end pt-4 border-t'>
                  <Button onClick={saveSettings} disabled={saving}>
                    <Save className='h-4 w-4 mr-2' />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Commission Rules Tab */}
        <TabsContent value='rules'>
          <Card className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-lg font-semibold flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Commission Rules
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Define commission percentages for each level and type
                </p>
              </div>
              <Button onClick={openNewRuleDialog}>
                <Plus className='h-4 w-4 mr-2' />
                Add Rule
              </Button>
            </div>

            {rules.length === 0 ? (
              <div className='text-center py-12 text-muted-foreground'>
                <TrendingUp className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>No commission rules defined yet</p>
                <p className='text-sm'>Add rules to define how commissions are calculated</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-muted/50'>
                    <tr className='text-left text-sm'>
                      <th className='p-3 font-medium'>Name</th>
                      <th className='p-3 font-medium'>Type</th>
                      <th className='p-3 font-medium'>Level</th>
                      <th className='p-3 font-medium'>Percentage</th>
                      <th className='p-3 font-medium'>Fixed Amount</th>
                      <th className='p-3 font-medium'>Status</th>
                      <th className='p-3 font-medium'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr key={rule.id} className='border-t hover:bg-muted/30'>
                        <td className='p-3 font-medium'>{rule.name}</td>
                        <td className='p-3'>
                          <Badge className={typeColors[rule.type]}>{rule.type}</Badge>
                        </td>
                        <td className='p-3'>
                          <span className='w-6 h-6 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-semibold'>
                            {rule.level}
                          </span>
                        </td>
                        <td className='p-3 font-semibold'>{Number(rule.percentage)}%</td>
                        <td className='p-3 text-muted-foreground'>
                          {rule.fixedAmount
                            ? `Rs. ${Number(rule.fixedAmount).toLocaleString()}`
                            : '-'}
                        </td>
                        <td className='p-3'>
                          <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className='p-3'>
                          <div className='flex gap-1'>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => openEditRuleDialog(rule)}
                              className='h-8 w-8 p-0'
                            >
                              <Edit2 className='h-4 w-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => deleteRule(rule.id)}
                              className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Commission Rule' : 'Add Commission Rule'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Rule Name</Label>
              <Input
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                placeholder='e.g., Level 1 Sales Commission'
                className='mt-1'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Type</Label>
                <select
                  value={ruleForm.type}
                  onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value as any })}
                  className='w-full mt-1 border rounded px-3 py-2'
                >
                  <option value='SALE'>Sale Commission</option>
                  <option value='SIGNUP'>Signup Bonus</option>
                  <option value='LEVEL_UP'>Level Up Bonus</option>
                  <option value='BONUS'>General Bonus</option>
                </select>
              </div>
              <div>
                <Label>Level</Label>
                <Input
                  type='number'
                  min={1}
                  max={10}
                  value={ruleForm.level}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, level: Number.parseInt(e.target.value) || 1 })
                  }
                  className='mt-1'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Percentage (%)</Label>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  step={0.1}
                  value={ruleForm.percentage}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, percentage: Number.parseFloat(e.target.value) || 0 })
                  }
                  className='mt-1'
                />
              </div>
              <div>
                <Label>Fixed Amount (Rs.)</Label>
                <Input
                  type='number'
                  min={0}
                  value={ruleForm.fixedAmount}
                  onChange={(e) => setRuleForm({ ...ruleForm, fixedAmount: e.target.value })}
                  placeholder='Optional'
                  className='mt-1'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Min Order Value (Rs.)</Label>
                <Input
                  type='number'
                  min={0}
                  value={ruleForm.minOrderValue}
                  onChange={(e) => setRuleForm({ ...ruleForm, minOrderValue: e.target.value })}
                  placeholder='Optional'
                  className='mt-1'
                />
              </div>
              <div>
                <Label>Max Commission (Rs.)</Label>
                <Input
                  type='number'
                  min={0}
                  value={ruleForm.maxCommission}
                  onChange={(e) => setRuleForm({ ...ruleForm, maxCommission: e.target.value })}
                  placeholder='Optional'
                  className='mt-1'
                />
              </div>
            </div>

            <div className='flex items-center justify-between p-3 border rounded'>
              <Label>Active</Label>
              <Switch
                checked={ruleForm.isActive}
                onCheckedChange={(checked) => setRuleForm({ ...ruleForm, isActive: checked })}
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <Button variant='outline' onClick={() => setRuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveRule} disabled={saving || !ruleForm.name}>
                {saving && 'Saving...'}
                {!saving && editingRule && 'Update Rule'}
                {!saving && !editingRule && 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
