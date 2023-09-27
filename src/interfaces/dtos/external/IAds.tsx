import { ApiResponse } from './IResponse';

export interface IAdSizes {
  id: string;
  name: string;
}

export interface IAdPattern {
  id: string;
  url: string;
}

export interface IAdsService {
  getAdSizes(): Promise<ApiResponse<IAdSizes[]>>;
}

export interface IAdsService {
  getAdPatterns(type: string): Promise<ApiResponse<IAdPattern[]>>;
}
