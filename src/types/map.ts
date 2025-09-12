// src/types/map.ts
export enum MapType {
  OPENLAYERS_GAODE = 'openlayers_gaode',
  GAME = 'game'
}

export interface MapBounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface MapInfo {
  id: number;
  name: string;
  type: MapType;
  isPublic: boolean;
  bounds?: MapBounds;
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

export interface MapConfig {
  extent?: [number, number, number, number];
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  projection?: string;
  enableDefaultControls?: boolean;
}