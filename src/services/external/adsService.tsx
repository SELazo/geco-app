import { environment } from '../../environment/environment';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import {
  IAdColours,
  IAdPattern,
  IAdSizes,
  IAdsService,
  INewAd,
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

export const AdsService: IAdsService = {
  getGeneratedAd: async (newAdInfo: INewAd): Promise<ApiResponse<string>> => {
    let img: string = '';
    const response = {
      success: true,
      data: img,
    };
    return response;
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
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '72px',
              textSize: '25px',
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
              titleSize: '72px',
              textSize: '25px',
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
              titleSize: '72px',
              textSize: '25px',
              titleWidth: '1050px',
              textWidth: '1050px',
            },
            {
              id: 'rh4',
              url: '/src/assets/images/rh_04.svg',
              width: '1920px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '72px',
              textSize: '25px',
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
              height: '1080px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '72px',
              textSize: '25px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv2',
              url: '/src/assets/images/rv_02.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-left',
              textDispostion: 'bottom-right',
              titleSize: '72px',
              textSize: '25px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv3',
              url: '/src/assets/images/rv_03.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'top-center',
              textDispostion: 'bottom-center',
              titleSize: '72px',
              textSize: '25px',
              titleWidth: '800px',
              textWidth: '665px',
            },
            {
              id: 'rv4',
              url: '/src/assets/images/rv_04.svg',
              width: '1080px',
              height: '1080px',
              padding: '108px',
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '72px',
              textSize: '25px',
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
              id: 's1',
              url: '/src/assets/images/s_01.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'center',
              textDispostion: 'center',
              titleSize: '62px',
              textSize: '18px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's2',
              url: '/src/assets/images/s_02.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'top-left',
              textDispostion: 'bottom-right',
              titleSize: '62px',
              textSize: '18px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's3',
              url: '/src/assets/images/s_03.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'top-center',
              textDispostion: 'bottom-center',
              titleSize: '62px',
              textSize: '18px',
              titleWidth: '710px',
              textWidth: '572px',
            },
            {
              id: 's4',
              url: '/src/assets/images/s_04.svg',
              width: '1080px',
              height: '1920px',
              padding: '108px',
              titleDisposition: 'bottom-right',
              textDispostion: 'bottom-right',
              titleSize: '62px',
              textSize: '18px',
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
};
