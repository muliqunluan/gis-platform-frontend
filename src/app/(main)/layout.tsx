import SideNav from '@/components/SideNav/SideNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      <SideNav />
      <main className="flex-1 flex flex-col bg-slate-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8 w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
