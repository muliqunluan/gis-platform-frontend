'use client';

import React, { useState } from 'react';
import { usePublishForm } from '@/context/PublishFormContext';
import MapRangeSelector from '@/components/organisms/MapRangeSelector';
import { Input } from '@/components/atoms/Input/Input';
import ToggleSwitch from '@/components/atoms/ToggleSwitch/ToggleSwitch';
import Button from '@/components/atoms/Button/Button';
import ErrorMessage from '@/components/atoms/ErrorMessage/ErrorMessage';
import Card from '@/components/atoms/Card/Card';

interface StandardMapConfigProps {
  onBack: () => void;
  onSubmit: () => void;
}

const projectionOptions = [
  { value: 'EPSG:3857', label: 'Web墨卡托投影' },
  { value: 'EPSG:4326', label: 'WGS84经纬度' },
];

export default function StandardMapConfig({ onBack, onSubmit }: StandardMapConfigProps) {
  const { formData, updateConfigForm } = usePublishForm();
  const [zoomRange, setZoomRange] = useState({
    min: formData.config?.minZoom || 0,
    max: formData.config?.maxZoom || 18,
  });
  const [defaultZoom, setDefaultZoom] = useState(formData.config?.zoom || 10);
  const [projection, setProjection] = useState(formData.config?.projection || 'EPSG:3857');
  const [enableDefaultControls, setEnableDefaultControls] = useState(
    formData.config?.enableDefaultControls ?? true
  );
  const [error, setError] = useState('');
  const [isMinZoomLocked, setIsMinZoomLocked] = useState(false);

  const handleExtentChange = (extent: [number, number, number, number]) => {
    updateConfigForm({ ...formData.config, extent });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (zoomRange.min >= zoomRange.max) {
      setError('最小缩放级别必须小于最大缩放级别');
      return;
    }

    if (defaultZoom < zoomRange.min || defaultZoom > zoomRange.max) {
      setError('默认缩放级别必须在最小和最大缩放级别之间');
      return;
    }

    updateConfigForm({
      extent: formData.config?.extent || [-180, -90, 180, 90],
      minZoom: zoomRange.min,
      maxZoom: zoomRange.max,
      zoom: defaultZoom,
      projection,
      enableDefaultControls,
    });

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 flex justify-center">
      <div className="grid gap-6 md:grid-cols-2 flex">
          <MapRangeSelector
          className="h-full justify-end"
            initialExtent={formData.config?.extent}
            onExtentChange={handleExtentChange}
            onZoomToExtent={(zoom) => {
              setZoomRange(prev => ({ ...prev, min: zoom }));
              setIsMinZoomLocked(true);
            }}
          />
        <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">缩放范围</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">最小缩放级别</label>
            <Input
              type="number"
              min="0"
              max="18"
              value={zoomRange.min}
              onChange={(e) => setZoomRange({...zoomRange, min: parseInt(e.target.value) || 0})}
              readOnly={isMinZoomLocked}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">最大缩放级别</label>
            <Input
              type="number"
              min="0"
              max="18"
              value={zoomRange.max}
              onChange={(e) => setZoomRange({...zoomRange, max: parseInt(e.target.value) || 18})}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">默认缩放级别</h2>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={zoomRange.min}
            max={zoomRange.max}
            value={defaultZoom}
            onChange={(e) => setDefaultZoom(parseInt(e.target.value) || 0)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">地图投影</h2>
        <div className="flex gap-4">
          {projectionOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={option.value}
                name="projection"
                value={option.value}
                checked={projection === option.value}
                onChange={() => setProjection(option.value)}
                className="mr-2"
              />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">启用默认地图控件</label>
        <ToggleSwitch
          initialValue={enableDefaultControls}
          onChange={setEnableDefaultControls}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="pt-4 flex gap-4 w-full">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="flex-1"
        >
          返回
        </Button>
        <Button
          type="submit"
          className="flex-1"
        >
          下一步
        </Button>
      </div>
        </Card>
      </div>
    </form>
  );
}