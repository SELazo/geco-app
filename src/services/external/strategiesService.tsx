import('../../styles/gstrategy.css');
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';
import { environment } from '../../environment/environment';
import { SessionService } from '../internal/sessionService';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { IError } from '../../interfaces/dtos/external/IError';
import {
  IStrategyResponse,
  IStrategyService,
} from '../../interfaces/dtos/external/IStrategies';

const { strategiesServiceURI } = environment;

export const StrategiesService: IStrategyService = {
  newStrategy: async (
    name: string,
    start_date: Date,
    end_date: Date,
    periodicity: string,
    schedule: string,
    ads: number[],
    groups: number[],
    form_type?: string,
    form_config?: any
  ): Promise<ApiResponse<IBasicSuccessResponse>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();

      const payload: any = {
        name,
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
        periodicity,
        schedule,
        ads,
        groups,
      };
      if (form_type) payload.form_type = form_type;
      if (form_config) payload.form_config = form_config;

      const response = await fetch(`${strategiesServiceURI}/strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
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

  deleteStrategy: async (
    id: number
  ): Promise<ApiResponse<IBasicSuccessResponse>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();

      const response = await fetch(`${strategiesServiceURI}/strategies/${id}`, {
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

  editStrategy: async (
    id: number,
    strategy: {
      name: string;
      start_date: Date;
      end_date: Date;
      periodicity: string;
      schedule: string;
      groups: number[];
      ads: number[];
      form_type?: string;
    }
  ): Promise<ApiResponse<IBasicSuccessResponse>> => {
    const token = localStorage.getItem('token');
    const payload: any = {
      name: strategy.name,
      start_date: strategy.start_date.toISOString(),
      end_date: strategy.end_date.toISOString(),
      periodicity: strategy.periodicity,
      schedule: strategy.schedule,
      groups: strategy.groups,
      ads: strategy.ads,
    };
    if (strategy.form_type) payload.form_type = strategy.form_type;

    const response = await fetch(`${strategiesServiceURI}/strategies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err: IError = await response.json();
      console.error(err);
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: err,
      };
      return errorResponse;
    }

    const data: IBasicSuccessResponse = await response.json();
    const successResponse: ApiResponse<IBasicSuccessResponse> = {
      success: true,
      data: data,
    };

    return successResponse;
  },

  getStrategy: async (id: number): Promise<IStrategyResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${strategiesServiceURI}/strategies/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    const data: IStrategyResponse = await response.json();
    return data;
  },

  getStrategies: async (params?: {
    name?: string;
  }): Promise<ApiResponse<IStrategyResponse[]>> =>
    new Promise(async (resolve, reject) => {
      let url = `${strategiesServiceURI}/strategies`;

      if (params) {
        const { name } = params;

        if (name) {
          url += `?name=${name}`;
        }
      }

      const token = SessionService.getToken();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const err: IError = await response.json();
        console.error(err);
        const errorResponse: ApiResponse<IStrategyResponse[]> = {
          success: false,
          error: err,
        };
        reject(errorResponse);
        return;
      }

      const loginResponse: IStrategyResponse[] = await response.json();
      const successResponse: ApiResponse<IStrategyResponse[]> = {
        success: true,
        data: loginResponse,
      };
      resolve(successResponse);
      return;
    }),
  sendStrategy: async (
    id: number
  ): Promise<ApiResponse<IBasicSuccessResponse>> =>
    new Promise(async (resolve, reject) => {
      const token = SessionService.getToken();

      const response = await fetch(
        `${strategiesServiceURI}/strategies/${id}/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );

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
