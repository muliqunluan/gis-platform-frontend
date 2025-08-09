'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MapTypeButton from '@/components/molecules/MapTypeButton/MapTypeButton';

interface MapTypeSelectionProps {
  onSelect?: () => void;
}

const MapTypeSelection: React.FC<MapTypeSelectionProps> = ({ onSelect }) => {
  const router = useRouter();

  const handleMapTypeClick = (mapType: string) => {
    // 导航到对应的地图类型配置页面
    onSelect ? onSelect() : router.push(`/map-types/${mapType}`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        选择地图类型
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <MapTypeButton
          name="卫星地图"
          imageUrl="https://picsum.photos/200/200?random=2"
          onClick={() => handleMapTypeClick('satellite')}
          className="hover:scale-105 transition-transform"
        />
        <MapTypeButton
          name="地形图"
          imageUrl="https://picsum.photos/200/200?random=3"
          onClick={() => handleMapTypeClick('terrain')}
          className="hover:scale-105 transition-transform"
        />
        <MapTypeButton
          name="街道地图"
          imageUrl="https://picsum.photos/200/200?random=9"
          onClick={() => handleMapTypeClick('street')}
          className="hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
};

export default MapTypeSelection;
