import React, { useEffect, useRef } from 'react';
import { Viewer, Cartesian3 } from 'cesium'; // 添加 Cartesian3 导入
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 配置 Cesium 静态资源路径
(window as any).CESIUM_BASE_URL = '/cesium/';

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
