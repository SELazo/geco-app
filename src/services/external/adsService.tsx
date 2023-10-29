import { environment } from '../../environment/environment';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import {
  IAdColours,
  IAdPattern,
  IAdSizes,
  IAdsService,
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
            },
            {
              id: 'rh2',
              url: '/src/assets/images/rh_02.svg',
            },
            {
              id: 'rh3',
              url: '/src/assets/images/rh_03.svg',
            },
            {
              id: 'rh4',
              url: '/src/assets/images/rh_04.svg',
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
            },
            {
              id: 'rv2',
              url: '/src/assets/images/rv_02.svg',
            },
            {
              id: 'rv3',
              url: '/src/assets/images/rv_03.svg',
            },
            {
              id: 'rv4',
              url: '/src/assets/images/rv_04.svg',
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
            },
            {
              id: 's2',
              url: '/src/assets/images/s_02.svg',
            },
            {
              id: 's3',
              url: '/src/assets/images/s_03.svg',
            },
            {
              id: 's4',
              url: '/src/assets/images/s_04.svg',
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
