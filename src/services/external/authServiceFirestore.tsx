import { IAuthService, ILoginResponse, IValidateSessionResponse } from '../../interfaces/dtos/external/IAuth';
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { IUser as IUserExternal } from '../../interfaces/dtos/external/IUser';
import AuthFirestoreService from './authFirestoreService';

export const AuthServiceFirestore: IAuthService = {
  login: async (email: string, password: string): Promise<ApiResponse<ILoginResponse>> => {
    try {
      const loginResult = await AuthFirestoreService.login(email, password);
      
      const loginResponse: ILoginResponse = {
        token: loginResult.token
      };

      const successResponse: ApiResponse<ILoginResponse> = {
        success: true,
        data: loginResponse,
      };

      console.log('✅ Login exitoso via Firestore');
      return successResponse;
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      const errorResponse: ApiResponse<ILoginResponse> = {
        success: false,
        error: {
          type: 'LOGIN_ERROR',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 401
        },
      };
      
      throw errorResponse;
    }
  },

  logout: async (): Promise<ApiResponse<IBasicSuccessResponse>> => {
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token') || '';
      
      await AuthFirestoreService.logout(token);

      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');

      const data: IBasicSuccessResponse = {
        type: 'success',
        code: 200,
        message: 'Sesión cerrada exitosamente'
      };

      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };

      console.log('✅ Logout exitoso via Firestore');
      return successResponse;
    } catch (error) {
      console.error('❌ Error en logout:', error);
      
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: {
          type: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 500
        },
      };
      
      throw errorResponse;
    }
  },

  validateSession: async (): Promise<ApiResponse<IValidateSessionResponse>> => {
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token') || '';
      
      if (!token) {
        throw new Error('No hay token de sesión');
      }

      const sessionData = await AuthFirestoreService.validateSession(token);
      
      if (!sessionData) {
        throw new Error('Sesión inválida o expirada');
      }

      const validateResponse: IValidateSessionResponse = {
        success: true,
        user: {
          id: parseInt(sessionData.user.id || '0', 10), // Convertir string a number para compatibilidad
          name: sessionData.user.name,
          email: sessionData.user.email,
        }
      };

      const successResponse: ApiResponse<IValidateSessionResponse> = {
        success: true,
        data: validateResponse,
      };

      console.log('✅ Validación de sesión exitosa via Firestore');
      return successResponse;
    } catch (error) {
      console.error('❌ Error validando sesión:', error);
      
      const errorResponse: ApiResponse<IValidateSessionResponse> = {
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 401
        },
      };
      
      throw errorResponse;
    }
  },

  signUp: async (name: string, email: string, password: string): Promise<ApiResponse<IBasicSuccessResponse>> => {
    try {
      await AuthFirestoreService.signUp(name, email, password);

      const data: IBasicSuccessResponse = {
        type: 'success',
        code: 201,
        message: 'Usuario creado exitosamente'
      };

      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };

      console.log('✅ Registro exitoso via Firestore');
      return successResponse;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: {
          type: 'SIGNUP_ERROR',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 400
        },
      };
      
      throw errorResponse;
    }
  },

  resetPasswordRequest: async (email: string): Promise<ApiResponse<IBasicSuccessResponse>> => {
    try {
      // Por ahora, implementación básica - en el futuro se puede expandir
      console.log('🔄 Solicitud de reset de contraseña para:', email);
      
      const data: IBasicSuccessResponse = {
        type: 'success',
        code: 200,
        message: 'Solicitud de reset enviada (funcionalidad en desarrollo)'
      };

      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };

      return successResponse;
    } catch (error) {
      console.error('❌ Error en reset password request:', error);
      
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: {
          type: 'error',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 400
        },
      };
      
      throw errorResponse;
    }
  },

  resetPassword: async (newPassword: string, passwordToken: string): Promise<ApiResponse<IBasicSuccessResponse>> => {
    try {
      // Por ahora, implementación básica - en el futuro se puede expandir
      console.log('🔄 Reset de contraseña con token:', passwordToken);
      
      const data: IBasicSuccessResponse = {
        type: 'success',
        code: 200,
        message: 'Contraseña actualizada (funcionalidad en desarrollo)'
      };

      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };

      return successResponse;
    } catch (error) {
      console.error('❌ Error en reset password:', error);
      
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: {
          type: 'error',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 400
        },
      };
      
      throw errorResponse;
    }
  },

  editUser: async (user: IUserExternal): Promise<ApiResponse<IBasicSuccessResponse>> => {
    try {
      // Por ahora, implementación básica - en el futuro se puede expandir
      console.log('🔄 Edición de usuario:', user.email);
      
      const data: IBasicSuccessResponse = {
        type: 'success',
        code: 200,
        message: 'Usuario actualizado (funcionalidad en desarrollo)'
      };

      const successResponse: ApiResponse<IBasicSuccessResponse> = {
        success: true,
        data: data,
      };

      return successResponse;
    } catch (error) {
      console.error('❌ Error editando usuario:', error);
      
      const errorResponse: ApiResponse<IBasicSuccessResponse> = {
        success: false,
        error: {
          type: 'error',
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 400
        },
      };
      
      throw errorResponse;
    }
  }
};

export default AuthServiceFirestore;
