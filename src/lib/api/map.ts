// src/lib/api/map.ts
import { MapType } from '@/types/map';
import { API_BASE_URL } from './config';

export interface CreateMapRequest {
  name: string;
  type: MapType;
  isPublic: boolean;
  groupName: string;
  description?: string;
  bounds?: [number, number, number, number];
  zoomRange?: [number, number];
  projection?: string;
  defaultZoom?: number;
  extent?: [number, number, number, number];
}

export interface MapResponse {
  id: number;
  name: string;
  type: MapType;
  isPublic: boolean;
  bounds?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
  zoomRange?: number[];
  owner: {
    id: number;
    email: string;
  };
  group: {
    id: number;
    name: string;
    description?: string;
  };
  createdAt: string;
}

export const mapApi = {
  async createMap(data: CreateMapRequest): Promise<MapResponse> {
    const response = await fetch(`${API_BASE_URL}/api/maps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = '创建地图失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText && !errorText.startsWith('<!DOCTYPE html>')) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async getMyMaps(): Promise<MapResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/maps/my`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      let errorMessage = '获取我的地图失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 忽略HTML错误页面
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async getPublicMaps(): Promise<MapResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/maps/public`);

    if (!response.ok) {
      let errorMessage = '获取公开地图失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 忽略HTML错误页面
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async getMapById(id: number): Promise<MapResponse> {
    const response = await fetch(`${API_BASE_URL}/api/maps/${id}`);

    if (!response.ok) {
      let errorMessage = '获取地图详情失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 忽略HTML错误页面
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async deleteMap(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/maps/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      let errorMessage = '删除地图失败';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 忽略HTML错误页面
      }
      throw new Error(errorMessage);
    }
  },
};