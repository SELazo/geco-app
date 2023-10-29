import { ApiResponse } from './IResponse';

export interface IAdSizes {
  id: string;
  name: string;
}

export interface IAdPattern {
  id: string;
  url: string;
}

export interface IAdColours {
  id: string;
  name: string;
  hex: string;
}

export interface IAdsService {
  getAdColours(): Promise<ApiResponse<IAdColours[]>>;
}

export interface IAdsService {
  getAdSizes(): Promise<ApiResponse<IAdSizes[]>>;
}

export interface IAdsService {
  getAdPatterns(type: string): Promise<ApiResponse<IAdPattern[]>>;
}
