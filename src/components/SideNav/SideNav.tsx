'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Label } from '@/components/atoms/Label/Label';
import Button from '@/components/atoms/Button/Button';
import NavigationItem from '@/components/atoms/NavigationItem/NavigationItem';
import { Divider } from '@/components/atoms/Divider/Divider';
import { NavigationConfig } from '@/config/navigation';

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  const mainNavItems = NavigationConfig.mainItems;
  const extraNavItem = NavigationConfig.extraItem;

  const goToUser = useCallback(() => {
    router.push('/user');
  }, [router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Determine active tab based on the current path
  const getActiveTab = () => {
    // Exact match for the root path
    if (pathname === '/') {
      return 'map';
    }

    // Find the most specific match by sorting paths by length descending
    const allNavItems = [...mainNavItems, extraNavItem];
    const sortedItems = allNavItems.sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0));

    const activeItem = sortedItems.find(item => item.href && pathname.startsWith(item.href));

    return activeItem ? activeItem.key : '';
  };

  const activeTab = getActiveTab();

  return (
    <aside className="w-60 bg-slate-600 text-white flex flex-col p-6 shadow-lg">
      <Label className="text-2xl font-bold mb-8">NeoMap</Label>

      {/* 主导航项 */}
      {mainNavItems.map((item) => (
        <NavigationItem
          key={item.key}
          label={item.label}
          active={activeTab === item.key}
          onClick={() => item.href && handleNavigation(item.href)}
        />
      ))}

      <Divider />

      {/* 额外导航项 */}
      <NavigationItem
        label={extraNavItem.label}
        active={activeTab === extraNavItem.key}
        onClick={() => extraNavItem.href && handleNavigation(extraNavItem.href)}
      />

      <div className="flex-grow" />
      <Button className="mb-2" onClick={goToUser}>
        个人账户
      </Button>
    </aside>
  );
}