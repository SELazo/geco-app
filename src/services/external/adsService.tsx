import { environment } from '../../environment/environment';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import {
  IAd,
  IAdColours,
  IAdPattern,
  IAdSizes,
  IAdsService,
  IGetAdResponse,
  INewAd,
  IPostAdResponse,
} from '../../interfaces/dtos/external/IAds';
import {
  GBlack,
  GBlue,
  GGray,
  GGreen,
  GPink,
  GRed,
  GWhite,
  GYellow,
} from '../../constants/palette';
import { SessionService } from '../internal/sessionService';
import { IError } from '../../interfaces/dtos/external/IError';
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';

export const AdsService: IAdsService = {
  sendBase64InChunks: async (base64: string, id: number): Promise<boolean> => {
    const token = SessionService.getToken();
    const chunks = splitBase64IntoChunks(base64, 100000);
    const url = `${environment.adsServiceURI}/ads/${id}/upload-image-chunk`;

    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunk = chunks[i];
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ chunk }),
        });
      } catch (error) {
        console.error(`Error en el envío del fragmento ${i + 1}:`, error);
        return false;
      }
    }
    return true;
  },

  getAdColours: async (): Promise<ApiResponse<IAdColours[]>> => {
    const response = {
      success: true,
      data: [
        { id: 'black', name: 'Negro', hex: GBlack },
        { id: 'gray', name: 'Gris', hex: GGray },
        { id: 'white', name: 'Blanco', hex: GWhite },
        { id: 'blue', name: 'Azul', hex: GBlue },
        { id: 'green', name: 'Verde', hex: GGreen },
        { id: 'pink', name: 'Rosa', hex: GPink },
        { id: 'red', name: 'Rojo', hex: GRed },
        { id: 'yellow', name: 'Amarillo', hex: GYellow },
      ],
    };
    return response;
  },
  getAdSizes: async (): Promise<ApiResponse<IAdSizes[]>> => {
    const response = {
      success: true,
      data: [
        { id: 's', name: 'Cuadrado' },
        { id: 'rh', name: 'Rectangular horizontal' },
        { id: 'rv', name: 'Rectangular vertical' },
      ],
    };
    return response;
  },
  getAdPatterns: async (type: string): Promise<ApiResponse<IAdPattern[]>> => {
    switch (type) {
      case 'rh':
        return {
          success: true,
          data: [
            {
              id: 'rh1',
              url: '/src/assets/images/rh_01.svg',
              width: '1920px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '1050px',
              textWidth: '1050px',
            },
            {
              id: 'rh2',
              url: '/src/assets/images/rh_02.svg',
              width: '1920px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-left',
              textDispostion: 'bottom-right',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '1050px',
              textWidth: '1050px',
            },
            {
              id: 'rh3',
              url: '/src/assets/images/rh_03.svg',
              width: '1920px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-center',
              textDispostion: 'bottom-center',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '1050px',
              textWidth: '1050px',
            },
            {
              id: 'rh4',
              url: '/src/assets/images/rh_04.svg',
              width: '1920px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '1050px',
              textWidth: '1050px',
            },
          ],
        };

      case 'rv':
        return {
          success: true,
          data: [
            {
              id: 'rv1',
              url: '/src/assets/images/rv_01.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv2',
              url: '/src/assets/images/rv_02.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'top-left',
              textDispostion: 'bottom-right',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv3',
              url: '/src/assets/images/rv_03.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'top-center',
              textDispostion: 'bottom-center',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv4',
              url: '/src/assets/images/rv_04.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '125px',
              textSize: '35px',
              titleWidth: '800px',
              textWidth: '665px',
            },
          ],
        };
      case 's':
        return {
          success: true,
          data: [
            {
              id: 's4',
              url: '/src/assets/images/s_04.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '100px',
              textSize: '30px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's2',
              url: '/src/assets/images/s_02.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-left',
              textDispostion: 'bottom-right',
              titleSize: '100px',
              textSize: '30px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's3',
              url: '/src/assets/images/s_03.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-center',
              textDispostion: 'bottom-center',
              titleSize: '100px',
              textSize: '30px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's1',
              url: '/src/assets/images/s_01.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '100px',
              textSize: '30px',
              titleWidth: '710px',
              textWidth: '572px',
            },
          ],
        };
      default:
        return {
          success: false,
          data: [],
        };
    }
  },
  postGenerateAd: async (ad: IAd): Promise<ApiResponse<IPostAdResponse>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();
      const response = await fetch(`${environment.adsServiceURI}/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ ...ad }),
      });

      if (!response.ok) {
        const err: IError = await response.json();
        console.error(err);
        const errorResponse: ApiResponse<IPostAdResponse> = {
          success: false,
          error: err,
        };
        reject(errorResponse);
        return;
      }

      const data: IPostAdResponse = await response.json();
      const successResponse: ApiResponse<IPostAdResponse> = {
        success: true,
        data: data,
      };
      resolve(successResponse);
      return;
    }),
  getAds: async (): Promise<ApiResponse<IGetAdResponse[]>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();
      const response = await fetch(`${environment.adsServiceURI}/ads`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const err: IError = await response.json();
        console.error(err);
        const errorResponse: ApiResponse<IGetAdResponse[]> = {
          success: false,
          error: err,
        };
        reject(errorResponse);
        return;
      }

      const data: IGetAdResponse[] = await response.json();
      const successResponse: ApiResponse<IGetAdResponse[]> = {
        success: true,
        data: data,
      };
      resolve(successResponse);
      return;
    }),
  deleteAd: async (id: number): Promise<ApiResponse<IBasicSuccessResponse>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();

      const response = await fetch(`${environment.adsServiceURI}/ads/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const err: IError = await response.json();
        console.error(err);
        const errorResponse: ApiResponse<IBasicSuccessResponse> = {
          success: false,
          error: err,
        };
        reject(errorResponse);
        return;
      }

      const data: IBasicSuccessResponse = await response.json();
      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };
      resolve(successResponse);
      return;
    }),
};

function splitBase64IntoChunks(
  base64String: string,
  chunkSize: number
): string[] {
  const totalChunks = Math.ceil(base64String.length / chunkSize);
  const chunks = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = base64String.slice(start, end);
    chunks.push(chunk);
  }

  return chunks;
}
