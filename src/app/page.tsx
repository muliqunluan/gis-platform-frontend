'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Label } from '@/components/atoms/Label/Label';
import Button from '@/components/atoms/Button/Button';
import NavigationItem from '@/components/atoms/NavigationItem/NavigationItem';
import { Divider } from '@/components/atoms/Divider/Divider';
import MapTypeSelection from '@/components/map-create/map-type-selection/map-type-selection';
import MapInfoForm from '@/components/map-create/map-info-form/MapInfoForm';
import MapRangeSelector from '@/components/organisms/MapRangeSelector';
import ImageSlider from '@/components/organisms/ImageSlider';

// 动态导入 MainMap 组件，禁用 SSR
const MainMap = dynamic(
  () => import('@/components/organisms/MainMap'),
  { ssr: false }
);
import { useAuth } from '@/hooks/useAuth';
import { NavigationConfig } from '@/config/navigation';

// 抽象导航类型
type ActiveTab = 'square' | 'publish' | 'workspace' | 'message' | 'map' | 'publish-info' | 'publish-config' | 'publish-confirm';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const { isLoading, isAuthenticated } = useAuth();

  // 导航配置抽象
  const mainNavItems = NavigationConfig.mainItems;
  const extraNavItem = NavigationConfig.extraItem;

  const goToUser = useCallback(() => {
    router.push('/user');
  }, [router]);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 中间件会处理重定向，这里不渲染任何内容
  }

  // 内容渲染抽象
  const renderContent = () => {
    const contentMap = {
      map: <MainMap />,
      square: <ImageSlider />,
      publish: <MapTypeSelection onSelect={() => handleTabChange('publish-info')} />,
      'publish-info': <MapInfoForm
        onSubmit={() => handleTabChange('publish-config')}
        onBack={() => handleTabChange('publish')}
      />,
      'publish-config': <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">地图配置</h2>
        <p className="text-gray-500">配置步骤待实现</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleTabChange('publish-info')} className="mr-2">上一步</Button>
          <Button onClick={() => handleTabChange('publish-confirm')}>下一步</Button>
        </div>
      </div>,
      'publish-confirm': <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">发布确认</h2>
        <p className="text-gray-500">确认步骤待实现</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleTabChange('publish-config')} className="mr-2">上一步</Button>
          <Button>发布地图</Button>
        </div>
      </div>,
      workspace: <MapRangeSelector />,
      message: null, // 消息页面待实现
    };

    return contentMap[activeTab] || null;
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-60 bg-slate-600 text-white flex flex-col p-6 shadow-lg">
        <Label className="text-2xl font-bold mb-8">NeoMap</Label>
        
        {/* 主导航项 */}
        {mainNavItems.map((item) => (
          <NavigationItem
            key={item.key}
            label={item.label}
            active={activeTab === item.key}
            onClick={() => handleTabChange(item.key as ActiveTab)}
          />
        ))}
        
        <Divider />
        
        {/* 额外导航项 */}
        <NavigationItem
          label={extraNavItem.label}
          active={activeTab === extraNavItem.key}
          onClick={() => handleTabChange(extraNavItem.key as ActiveTab)}
        />
        
        <div className="flex-grow" />
        <Button className="mb-2" onClick={goToUser}>
          个人账户
        </Button>
      </aside>

      <main className={`flex-1 flex flex-col bg-slate-50 P-0`}>
        <div className="flex-1 flex flex-col">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
