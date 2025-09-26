import SideNav from '@/components/SideNav/SideNav';
import QueryProvider from '@/components/layouts/QueryProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex h-screen bg-slate-100">
        <SideNav />
        <main className="flex-1 flex flex-col bg-slate-50">
          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </QueryProvider>
  );
}
