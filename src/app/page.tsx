'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/atoms/Label/Label';
import Button from '@/components/atoms/Button/Button';
import NavigationItem from '@/components/atoms/NavigationItem/NavigationItem';
import LogoutButton from '@/components/atoms/LogoutButton/LogoutButton';
import { Divider } from '@/components/atoms/Divider/Divider';
import MapTypeSelection from '@/components/map-create/map-type-selection/map-type-selection';
import MapRangeSelector from '@/components/organisms/MapRangeSelector';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'square' | 'publish' | 'workspace' | 'message'>('square');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const goToUser = () => {
    router.push('/user');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-600 text-white flex flex-col p-6 shadow-lg">
        <Label className="text-2xl font-bold mb-8">NeoMap</Label>
        <NavigationItem
          label="地图广场"
          active={activeTab === 'square'}
          onClick={() => setActiveTab('square')}
        />
        <NavigationItem
          label="发布地图"
          active={activeTab === 'publish'}
          onClick={() => setActiveTab('publish')}
        />
        <NavigationItem
          label="工作台"
          active={activeTab === 'workspace'}
          onClick={() => setActiveTab('workspace')}
        />
        <Divider />
        <NavigationItem
          label="消息"
          active={activeTab === 'message'}
          onClick={() => setActiveTab('message')}
        />
        <div className="flex-grow" />
        <Button className="mb-2" onClick={goToUser}>
          个人账户
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        {activeTab === 'square' && <div>这里是地图广场内容（未实现）</div>}
        {activeTab === 'publish' && <MapTypeSelection />}
        {activeTab === 'workspace' && <MapRangeSelector/>}
      </main>
    </div>
  );
}
