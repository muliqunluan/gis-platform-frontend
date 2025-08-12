'use client';

import { useCallback, useState } from 'react';
import { PublishFormProvider, usePublishForm } from '@/context/PublishFormContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Label } from '@/components/atoms/Label/Label';
import Button from '@/components/atoms/Button/Button';
import NavigationItem from '@/components/atoms/NavigationItem/NavigationItem';
import { Divider } from '@/components/atoms/Divider/Divider';
import MapTypeSelection from '@/components/map-create/map-type-selection/map-type-selection';
import MapInfoForm from '@/components/map-create/map-info-form/MapInfoForm';
import StandardMapConfig from '@/components/map-create/map-config/StandardMapConfig';
import MapPublishConfirm from '@/components/map-create/map-preview/MapPublishConfirm';
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

function HomeContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const { isLoading, isAuthenticated } = useAuth();
  const { updateInfoForm, updatePreviewForm, resetForm } = usePublishForm();

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
    return null; // 中间件会处理重定向
  }

  // 内容渲染抽象
  const renderContent = () => {
    const contentMap = {
      map: <MainMap />,
      square: <ImageSlider />,
      publish: <MapTypeSelection onSelect={() => handleTabChange('publish-info')} />,
      'publish-info': <MapInfoForm
        onSubmit={(data) => {
          // 保存表单数据到context
          updateInfoForm(data);
          handleTabChange('publish-config');
        }}
        onBack={() => handleTabChange('publish')}
      />,
      'publish-config': <StandardMapConfig
        onBack={() => handleTabChange('publish-info')}
        onSubmit={() => handleTabChange('publish-confirm')}
      />,
      'publish-confirm': <MapPublishConfirm
        onBack={() => handleTabChange('publish-config')}
        onPublish={() => {
          updatePreviewForm({ confirmed: true });
          console.log('发布地图数据');
          resetForm();
          handleTabChange('map');
        }}
      />,
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

      <main className="flex-1 flex flex-col bg-slate-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8 w-full h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <PublishFormProvider>
      <HomeContent />
    </PublishFormProvider>
  );
}
