import AdminMembersTable from '@/shared/components/admin/mlm/MembersTable';

export default function AdminMLMMembersPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>MLM Members</h1>
        <p className='text-muted-foreground'>Manage and view all MLM network members</p>
      </div>
      <AdminMembersTable />
    </div>
  );
}
