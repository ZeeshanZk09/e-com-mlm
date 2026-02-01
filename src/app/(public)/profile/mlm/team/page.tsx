import TreeViewer from '@/shared/components/mlm/TreeViewer';

export default function UserMLMTeamPage() {
  return (
    <section className='min-h-screen w-full flex p-6 flex-col gap-6 max-w-6xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold'>My Team</h1>
        <p className='text-muted-foreground'>View your downline network and team structure</p>
      </div>
      <TreeViewer />
    </section>
  );
}
