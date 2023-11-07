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
  ads: number[];
  groups: number[];
}

export interface IStrategyService {
  newStrategy(
    name: string,
    start_date: Date,
    end_date: Date,
    periodicity: string,
    schedule: string,
    ads: number[],
    groups: number[]
  ): Promise<ApiResponse<IBasicSuccessResponse>>;
  deleteStrategy(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
  editStrategy(
    id: number,
    name: string,
    start_date: Date,
    end_date: Date,
    periodicity: string,
    schedule: string,
    ads: number[],
    groups: number[]
  ): Promise<ApiResponse<IBasicSuccessResponse>>;
  getStrategy(id: number): Promise<IStrategyResponse>;
  getStrategies(params?: {
    name?: string;
  }): Promise<ApiResponse<IStrategyResponse[]>>;
  sendStrategy(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
}
