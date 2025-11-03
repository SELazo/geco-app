import { IBasicSuccessResponse } from './IBasicResponse';
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
  titleAd?: string;
  textAd?: string;
  img: File | string;
  template: IAdPattern;
  pallette: string;
  titleColor?: string; // Color específico para el título (hex)
  textColor?: string;  // Color específico para el texto (hex)
}

export interface IAd {
  title: string;
  description: string;
  size: string;
  image?: string;
  ad_template: {
    color_text: string;
    type: string;
    disposition_pattern: string;
  };
}

export interface IPostAdResponse {
  id: number;
  description: string;
  title: string;
  size: string;
  create_date: string;
  deleted_date: string | null;
  ad_template: {
    id: number;
    color_text: string;
    type: string;
    disposition_pattern: string;
  };
}

export interface IGetAdResponse {
  id: number | string; // Puede ser number (backend) o string (Firestore)
  description: string;
  title: string;
  size: string;
  create_date: string;
  deleted_date: string | null;
  account_id: number;
  ad_template: {
    id: number;
    color_text: string;
    type: string;
    disposition_pattern: string;
  };
  imageUrl?: string; // Imagen base64 desde Firestore
  firestoreId?: string; // ID original de Firestore
  firestoreData?: any; // Datos completos de Firestore
}

export interface IAdsService {
  getAdColours(): Promise<ApiResponse<IAdColours[]>>;
  getAdSizes(): Promise<ApiResponse<IAdSizes[]>>;
  getAdPatterns(type: string): Promise<ApiResponse<IAdPattern[]>>;
  postGenerateAd(newAdInfo: IAd): Promise<ApiResponse<IPostAdResponse>>;
  sendBase64InChunks(base64: string, id: number): Promise<boolean>;
  getAds(): Promise<ApiResponse<IGetAdResponse[]>>;
  getAdImg(id: number): any;
  deleteAd(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
  editAd(
    id: number,
    description: string,
    title: string
  ): Promise<ApiResponse<IBasicSuccessResponse>>;
}
