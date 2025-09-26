'use client';

import React, { useState } from 'react';
import { usePublishForm } from '@/context/PublishFormContext';
import Button from '@/components/atoms/Button/Button';
import { mapApi, CreateMapRequest, MapResponse } from '@/lib/api/map';
import { MapType } from '@/types/map';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface MapPublishConfirmProps {
  onBack: () => void;
  onPublish: () => void;
}

export default function MapPublishConfirm({ onBack, onPublish }: MapPublishConfirmProps) {
  const { formData } = usePublishForm();
  const [error, setError] = useState('');
  const router = useRouter();

  const mutation = useMutation<MapResponse, Error, CreateMapRequest>({
    mutationFn: (mapData: CreateMapRequest) => mapApi.createMap(mapData),
    onSuccess: (data) => {
      toast.success('地图发布成功!');
      onPublish();
      // 跳转到新创建的地图页面或地图列表页
      router.push(`/maps`);
    },
    onError: (err: Error) => {
      toast.error(err.message || '发布地图失败');
      setError(err.message || '发布地图失败');
    },
  });

  const handlePublish = async () => {
    if (!formData.info || !formData.config) {
      setError('请完善地图信息');
      return;
    }
    setError('');

    const mapData = {
      name: formData.info.name,
      type: MapType.OPENLAYERS_GAODE, // 默认使用高德地图类型
      isPublic: formData.info.isPublic,
      groupName: formData.info.groupName,
      description: formData.info.description,
      bounds: formData.config.extent,
      zoomRange: formData.config.minZoom && formData.config.maxZoom
        ? [formData.config.minZoom, formData.config.maxZoom] as [number, number]
        : undefined,
      projection: formData.config.projection,
      defaultZoom: formData.config.zoom,
      extent: formData.config.extent,
    };

    mutation.mutate(mapData);
  };

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
          <div>
            <label className="block text-sm font-medium">默认缩放级别</label>
            <p className="mt-1">{formData.config?.zoom}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">地图范围</label>
          <p className="mt-1">
            {formData.config?.extent ? formData.config.extent.join(', ') : '全球'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="pt-4 flex gap-4 w-full">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="flex-1"
          disabled={mutation.isPending}
        >
          返回修改
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          className="flex-1"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? '发布中...' : '确认发布'}
        </Button>
      </div>
    </div>
  );
}