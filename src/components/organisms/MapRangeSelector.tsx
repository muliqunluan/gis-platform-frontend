import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import Draw, { createBox } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import { getArea } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import Button from '@/components/atoms/Button/Button'
import Card from '@/components/atoms/Card/Card'
import { Divider } from '../atoms/Divider/Divider';
import { Input } from '../atoms/Input/Input';
import { Label } from '../atoms/Label/Label';
import Title from '../atoms/Title/Title'
import ErrorMessage from '../atoms/ErrorMessage/ErrorMessage';


interface MapRangeSelectorProps {
  initialView?: {
    center?: [number, number];
    zoom?: number;
  };
  onExtentChange?: (extent: [number, number, number, number]) => void;
}

const MapRangeSelector: React.FC<MapRangeSelectorProps> = ({
  initialView = { center: [116.4, 39.9], zoom: 10 },
  onExtentChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [extent, setExtent] = useState<[number, number, number, number] | null>(null);
  const [inputValues, setInputValues] = useState({
    minLon: '',
    minLat: '',
    maxLon: '',
    maxLat: '',
  });
  const [error, setError] = useState<string | null>(null);

  // 高德地图URL模板
  const gaodeUrl = 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}';

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = new Map({
      target: mapRef.current,
      controls: defaultControls({
        rotate: false,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: gaodeUrl,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat(initialView.center || [116.4, 39.9]),
        zoom: initialView.zoom || 10,
      }),
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  // 处理绘制交互
  useEffect(() => {
  if (!map) return;

  let drawInteraction: Draw | null = null;
  let vectorLayer: VectorLayer<VectorSource> | null = null;

  const source = new VectorSource();
  vectorLayer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
  });
  map.addLayer(vectorLayer);

  drawInteraction = new Draw({
    source,
    type: 'Circle',
    geometryFunction: createBox(),
  });

  map.addInteraction(drawInteraction);

drawInteraction.on('drawend', (evt) => {
  setTimeout(() => {
    source.clear();
    source.addFeature(evt.feature);

    const geometry = evt.feature.getGeometry();
    if (geometry) {
      const extent = geometry.getExtent();
      const minLonLat = toLonLat([extent[0], extent[1]]);
      const maxLonLat = toLonLat([extent[2], extent[3]]);

      const newExtent: [number, number, number, number] = [
        minLonLat[0],
        minLonLat[1],
        maxLonLat[0],
        maxLonLat[1],
      ];

      setExtent(newExtent);
      setInputValues({
        minLon: minLonLat[0].toFixed(6),
        minLat: minLonLat[1].toFixed(6),
        maxLon: maxLonLat[0].toFixed(6),
        maxLat: maxLonLat[1].toFixed(6),
      });

      if (onExtentChange) {
        onExtentChange(newExtent);
      }
    }
  }, 0);
});


  return () => {
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
    }
    if (vectorLayer) {
      map.removeLayer(vectorLayer);
    }
  };
}, [map]);


  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 应用表单中的范围
  const applyFormExtent = () => {
    try {
      const minLon = parseFloat(inputValues.minLon);
      const minLat = parseFloat(inputValues.minLat);
      const maxLon = parseFloat(inputValues.maxLon);
      const maxLat = parseFloat(inputValues.maxLat);
      
      if (
        isNaN(minLon) || isNaN(minLat) || 
        isNaN(maxLon) || isNaN(maxLat)
      ) {
        throw new Error('请输入有效的经纬度数值');
      }
      
      if (minLon >= maxLon || minLat >= maxLat) {
        throw new Error('最小经度/纬度必须小于最大经度/纬度');
      }
      
      const newExtent: [number, number, number, number] = [
        minLon, minLat, maxLon, maxLat
      ];
      
      setExtent(newExtent);
      setError(null);
      
      if (onExtentChange) {
        onExtentChange(newExtent);
      }
      
      // 如果有地图，可以缩放到这个范围
      if (map) {
        const view = map.getView();
        const extentGeom = [...fromLonLat([minLon, minLat]), ...fromLonLat([maxLon, maxLat])];
        view.fit(extentGeom, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      }
    } catch (err:any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Card>
      <Title>地图范围选择器</Title>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">

          
          {extent && (
            <Button onClick={() => {
              if (map && extent) {
                const extentGeom = [...fromLonLat([extent[0], extent[1]]), ...fromLonLat([extent[2], extent[3]])];
                map.getView().fit(extentGeom, {
                  padding: [50, 50, 50, 50],
                  duration: 1000,
                });
              }
            }}>
              缩放到选定范围
            </Button>
          )}
        </div>
        
        <div ref={mapRef} className="w-full h-96 border rounded-md" />
        
        <Divider />
        
        <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-md mx-auto">
  {/* 顶部：最大纬度 */}
  <div className="col-start-2 row-start-1">
    <Input
      name="maxLat"
      value={inputValues.maxLat}
      onChange={handleInputChange}
      placeholder="最大纬度"
    />
  </div>

  {/* 左侧：最小经度 */}
  <div className="col-start-1 row-start-2">
    <Input
      name="minLon"
      value={inputValues.minLon}
      onChange={handleInputChange}
      placeholder="最小经度"
    />
  </div>

  {/* 右侧：最大经度 */}
  <div className="col-start-3 row-start-2">
    <Input
      name="maxLon"
      value={inputValues.maxLon}
      onChange={handleInputChange}
      placeholder="最大经度"
    />
  </div>

  {/* 底部：最小纬度 */}
  <div className="col-start-2 row-start-3">
    <Input
      name="minLat"
      value={inputValues.minLat}
      onChange={handleInputChange}
      placeholder="最小纬度"
    />
  </div>
</div>

        
        {error && (
          <ErrorMessage message={error} />
        )}
        
        <div className="flex justify-between">
          <Button onClick={applyFormExtent}>
            应用范围
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapRangeSelector;
