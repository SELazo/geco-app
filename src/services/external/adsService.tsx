import { environment } from '../../environment/environment';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import {
  IAdPattern,
  IAdSizes,
  IAdsService,
} from '../../interfaces/dtos/external/IAds';

const { contactsApiURI } = environment;

export const AdsService: IAdsService = {
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
              id: 's2',
              url: '/src/assets/images/rh_02.svg',
            },
            {
              id: 's3',
              url: '/src/assets/images/rh_03.svg',
            },
            {
              id: 's4',
              url: '/src/assets/images/rh_04.svg',
            },
          ],
        };

      case 'rv':
        return {
          success: true,
          data: [
            {
              id: 'rh1',
              url: '/src/assets/images/rv_01.svg',
            },
            {
              id: 's2',
              url: '/src/assets/images/rv_02.svg',
            },
            {
              id: 's3',
              url: '/src/assets/images/rv_03.svg',
            },
            {
              id: 's4',
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
