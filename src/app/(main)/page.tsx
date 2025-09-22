'use client';

import { PublishFormProvider, usePublishForm } from '@/context/PublishFormContext';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import HexMapTest from '@/components/hex-map-test/HexMapTest';

// 动态导入 MainMap 组件，禁用 SSR
const MainMap = dynamic(
  () => import('@/components/organisms/MainMap'),
  { ssr: false }
);

function HomeContent() {
  const { isLoading, isAuthenticated } = useAuth();

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

  // For now, the root page will only show the MainMap.
  // Routing will handle other pages.
  return <MainMap />;
}

export default function Home() {
  return (
    <PublishFormProvider>
      <HomeContent />
    </PublishFormProvider>
  );
}
