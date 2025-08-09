'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Image from '../Image/Image';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  initialImageUrl?: string;
}

export default function ImageUploader({ 
  onImageUpload,
  initialImageUrl 
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {imageUrl ? (
        <div className="relative group">
          <Image 
            src={imageUrl} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
          >
            更换图片
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerFileInput}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          上传图片
        </button>
      )}
    </div>
  );
}