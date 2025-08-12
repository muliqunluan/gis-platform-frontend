'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input/Input';
import ToggleSwitch from '@/components/atoms/ToggleSwitch/ToggleSwitch';
import ImageUploader from '@/components/atoms/ImageUploader/ImageUploader';
import Button from '@/components/atoms/Button/Button';
import ErrorMessage from '@/components/atoms/ErrorMessage/ErrorMessage';
import Card from '@/components/atoms/Card/Card';

interface MapInfoFormProps {
  onBack?: () => void;
  onSubmit: (data: {
    name: string;
    isPublic: boolean;
    groupName: string;
    description: string;
    image?: File;
  }) => void;
  initialValues?: {
    name?: string;
    isPublic?: boolean;
    groupName?: string;
    description?: string;
    imageUrl?: string;
  };
}

export default function MapInfoForm({
  onSubmit,
  initialValues,
  onBack
}: MapInfoFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic || false);
  const [groupName, setGroupName] = useState(initialValues?.groupName || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('地图名称不能为空');
      return;
    }

    if (!groupName.trim()) {
      setError('群组名称不能为空');
      return;
    }

    setError('');
    onSubmit({
      name,
      isPublic,
      groupName,
      description,
      image: imageFile
    });
  };

  return (
    <Card>
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          地图名称
        </label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="输入地图名称"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          公开状态
        </label>
        <ToggleSwitch
          initialValue={isPublic}
          onChange={setIsPublic}
        />
      </div>

     <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
         群组名称
       </label>
       <Input
         value={groupName}
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
         placeholder="输入新群组名称"
       />
     </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          地图介绍
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          placeholder="输入地图介绍"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          展示图片
        </label>
        <ImageUploader
          initialImageUrl={initialValues?.imageUrl}
          onImageUpload={setImageFile}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="pt-4 flex gap-2">
        {onBack && (
          <Button
            type="button"
            onClick={onBack}
            variant="ghost"
            className="flex-1"
          >
            返回
          </Button>
        )}
        <Button
          type="submit"
          className={onBack ? "flex-1" : "w-full"}
        >
          提交
        </Button>
      </div>
    </form>
    </Card>
  );
}