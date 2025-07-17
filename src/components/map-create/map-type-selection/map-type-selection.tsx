'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MapTypeButton from '@/components/molecules/MapTypeButton/MapTypeButton';

const MapTypeSelection: React.FC = () => {
  const router = useRouter();

  const handleMapTypeClick = (mapType: string) => {
    // 导航到对应的地图类型配置页面
    router.push(`/map-types/${mapType}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>选择地图类型</h2>
      <div style={styles.buttonGroup}>
        <MapTypeButton
          name="卫星地图"
          imageUrl="https://picsum.photos/200/200?random=2"  // 替换为实际图片URL
          onClick={() => handleMapTypeClick('satellite')}
        />
        <MapTypeButton
          name="地形图"
          imageUrl="https://picsum.photos/200/200?random=3"  // 替换为实际图片URL
          onClick={() => handleMapTypeClick('terrain')}
        />
        <MapTypeButton
          name="街道地图"
          imageUrl="https://picsum.photos/200/200?random=9"  // 替换为实际图片URL
          onClick={() => handleMapTypeClick('street')}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '2rem',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  } as React.CSSProperties,
};

export default MapTypeSelection;
