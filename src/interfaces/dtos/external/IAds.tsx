import { ApiResponse } from './IResponse';

export interface IAdSizes {
  id: string;
  name: string;
}

export interface IAdPattern {
  id: string;
  url: string;
  width: string;
  height: string;
  padding: string;
  titleDisposition: string;
  titleSize: string;
  textDispostion: string;
  textSize: string;
  titleWidth: string;
  textWidth: string;
}

export interface IAdColours {
  id: string;
  name: string;
  hex: string;
}

export interface INewAd {
  titleAd: string;
  textAd: string;
  img: File | string;
  template: IAdPattern;
  pallette: string;
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

export interface IAdsService {
  getGeneratedAd(newAdInfo: INewAd): Promise<ApiResponse<string>>;
}
