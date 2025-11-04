import { IBasicSuccessResponse } from './IBasicResponse';
import { ApiResponse } from './IResponse';

export interface IStrategyResponse {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  periodicity: string;
  schedule: string;
  account_id: number;
  ads: (number | string)[]; // ✅ Compatibilidad con Firestore
  groups: (number | string)[]; // ✅ Compatibilidad con Firestore
}

export interface IStrategyService {
  newStrategy(
    name: string,
    start_date: Date,
    end_date: Date,
    periodicity: string,
    schedule: string,
    ads: (number | string)[],
    groups: (number | string)[],
    form_type?: string,
    form_config?: any
  ): Promise<ApiResponse<IBasicSuccessResponse>>;
  deleteStrategy(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
  editStrategy(
    id: number,
    strategy: {
      name: string;
      start_date: Date;
      end_date: Date;
      periodicity: string;
      schedule: string;
      ads: (number | string)[];
      groups: (number | string)[];
      form_type?: string;
      form_config?: any;
    }
  ): Promise<ApiResponse<IBasicSuccessResponse>>;
  getStrategy(id: number): Promise<IStrategyResponse>;
  getStrategies(params?: {
    name?: string;
  }): Promise<ApiResponse<IStrategyResponse[]>>;
  sendStrategy(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
}
