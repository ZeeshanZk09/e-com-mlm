import WalletComponent from '@/shared/components/mlm/Wallet';

export default function UserMLMWalletPage() {
  return (
    <section className='min-h-screen w-full flex p-6 flex-col gap-6 max-w-6xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold'>My Wallet</h1>
        <p className='text-muted-foreground'>Manage your wallet and request withdrawals</p>
      </div>
      <WalletComponent />
    </section>
  );
}
