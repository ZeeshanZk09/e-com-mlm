import CommissionTable from '@/shared/components/mlm/CommissionTable';

export default function UserMLMCommissionsPage() {
  return (
    <section className='min-h-screen w-full flex p-6 flex-col gap-6 max-w-6xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold'>My Commissions</h1>
        <p className='text-muted-foreground'>View your commission history and earnings</p>
      </div>
      <CommissionTable />
    </section>
  );
}
