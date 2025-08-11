'use client';

import React from 'react';
import { usePublishForm } from '@/context/PublishFormContext';
import Button from '@/components/atoms/Button/Button';

interface MapPublishConfirmProps {
  onBack: () => void;
  onPublish: () => void;
}

export default function MapPublishConfirm({ onBack, onPublish }: MapPublishConfirmProps) {
  const { formData } = usePublishForm();

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold">确认地图发布</h2>
      
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-semibold">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">地图名称</label>
            <p className="mt-1">{formData.info?.name || '未设置'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">地图描述</label>
            <p className="mt-1">{formData.info?.description || '未设置'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <h3 className="text-lg font-semibold">配置信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">投影方式</label>
            <p className="mt-1">
              {formData.config?.projection === 'EPSG:3857' ? 'Web墨卡托投影' : 'WGS84经纬度'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium">缩放范围</label>
            <p className="mt-1">
              {formData.config?.minZoom} - {formData.config?.maxZoom}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-4 w-full">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="flex-1"
        >
          返回修改
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          className="flex-1"
        >
          确认发布
        </Button>
      </div>
    </div>
  );
}