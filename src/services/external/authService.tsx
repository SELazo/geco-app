import { IAuthService, ILoginResponse, IValidateSessionResponse } from '../../interfaces/dtos/external/IAuth';
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';
import { environment } from '../../environment/environment';
import { IError } from '../../interfaces/dtos/external/IError';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';

const { authServiceURI } = environment;

export const AuthService: IAuthService = {
  login: async (email: string, password: string): Promise<ApiResponse<ILoginResponse>> => new Promise(async (resolve, reject) => {
    const response = await fetch(`${authServiceURI}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const err: IError = await response.json();
      console.error(err);
      const errorResponse: ApiResponse<ILoginResponse> = {
        success: false,
        error: err,
      };
      reject(errorResponse);
      return;
    }
  
    const loginResponse: ILoginResponse = await response.json();
    const successResponse: ApiResponse<ILoginResponse> = {
      success: true,
      data: loginResponse,
    };
    resolve(successResponse);
    return;
  }),

  logout: async (): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${authServiceURI}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    });

    localStorage.removeItem('token');

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  validateSession: async (): Promise<ApiResponse<IValidateSessionResponse>> => new Promise( async(resolve, reject) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${authServiceURI}/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    });
  
    if (!response.ok) {
      const err: IError = await response.json();
      console.error(err);
      const errorResponse: ApiResponse<IValidateSessionResponse> = {
        success: false,
        error: err,
      };
      reject(errorResponse);
      return;
    }
  
    const data: IValidateSessionResponse = await response.json();
    const successResponse: ApiResponse<IValidateSessionResponse> = {
      success: true,
      data: data,
    };
    resolve(successResponse);
    return;
  }),

  signUp: async (name: string, email: string, password: string): Promise<ApiResponse<IBasicSuccessResponse>> => new Promise( async(resolve, reject) => {
    const response = await fetch(`${authServiceURI}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
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
  
  resetPasswordRequest: async (email: string): Promise<ApiResponse<IBasicSuccessResponse>> => new Promise( async(resolve, reject) => {
    const response = await fetch(`${authServiceURI}/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
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

  resetPassword: async (newPassword: string, passwordToken: string): Promise<ApiResponse<IBasicSuccessResponse>> => new Promise( async (resolve, reject) => {
    const response = await fetch(`${authServiceURI}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-reset-password-token': `${passwordToken}`
      },
      body: JSON.stringify({ new_password: newPassword }),
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
  })
};
