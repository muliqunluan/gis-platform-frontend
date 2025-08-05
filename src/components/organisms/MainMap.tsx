import React, { useEffect, useRef } from 'react';
import { Viewer, Cartesian3, Ion } from 'cesium'; // 添加 Cartesian3 和 Ion 导入
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 配置 Cesium 静态资源路径
(window as any).CESIUM_BASE_URL = '/cesium/';

// Cesium Ion 访问令牌
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4OWM1MTAyYi00MjhjLTQ0MGQtYTgxMy1hOTI2ODg1Yzk5ZTciLCJpZCI6MzI3MzA3LCJpYXQiOjE3NTM5MzM2NzF9.PfBkn66mJ7MBmwCn7BVN5rasMZ-thVz_zQNGfaet_7k';

const MainMap = () => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;
    
    // 初始化 Cesium Viewer
    viewerRef.current = new Viewer(cesiumContainer.current, {
      animation: false,
      timeline: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      scene3DOnly: true,
    });

    // 设置宇宙视角（地球外）
    viewerRef.current.scene.camera.setView({
      destination: Cartesian3.fromDegrees(0, 0, 10000000), // 10000公里高度
      orientation: {
        heading: 0,
        pitch: -Math.PI/2, // 俯视地球
        roll: 0
      }
    });

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={cesiumContainer}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MainMap;
