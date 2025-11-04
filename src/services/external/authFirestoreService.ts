import { FirestoreService } from './firestoreService';
import { IUser, ISession } from '../../interfaces/dtos/external/IFirestore';
import bcrypt from 'bcryptjs';

export class AuthFirestoreService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly SESSIONS_COLLECTION = 'session'; // Nombre correcto: session (singular)
  private static readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora en millisegundos


  /**
   * Generar hash de contraseña con salt de longitud 12
   * Usando Web Crypto API para compatibilidad con navegador
   */
  private static async hashPassword(password: string): Promise<string> {
    try {
      // Generar salt aleatorio
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const saltString = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Crear hash usando Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(password + saltString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return `${saltString}:${hashHex}`;
    } catch (error) {
      // Fallback a hash simple si Web Crypto no está disponible
      return `simple:${btoa(password + 'geco-salt-12-chars')}`;
    }
  }

  /**
   * Verificar contraseña contra hash
   */
  private static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      if (hash.startsWith('simple:')) {
        // Verificación para hash simple (fallback)
        const expectedHash = `simple:${btoa(password + 'geco-salt-12-chars')}`;
        return hash === expectedHash;
      }
      
      // Verificación para hash con Web Crypto API
      const [saltString, expectedHashHex] = hash.split(':');
      
      const encoder = new TextEncoder();
      const data = encoder.encode(password + saltString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const actualHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return actualHashHex === expectedHashHex;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generar token único para sesión
   */
  private static generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Registrar nuevo usuario
   */
  static async signUp(name: string, email: string, password: string): Promise<string> {
    try {
      // Verificar si el usuario ya existe
      const existingUsers = await FirestoreService.findBy(
        this.USERS_COLLECTION,
        'email',
        '==',
        email.toLowerCase()
      );

      if (existingUsers.length > 0 && !existingUsers[0].isDeleted) {
        throw new Error('El usuario ya existe');
      }

      // Hash de la contraseña
      const hashedPassword = await this.hashPassword(password);

      // Crear usuario
      const userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isDeleted: false
      };

      const userId = await FirestoreService.create(this.USERS_COLLECTION, userData);
      return userId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(email: string, password: string): Promise<{ user: IUser; token: string; sessionId: string }> {
    try {
      // Buscar usuario por email
      const users = await FirestoreService.findBy(
        this.USERS_COLLECTION,
        'email',
        '==',
        email.toLowerCase()
      );
      
      if (users.length === 0 || users[0].isDeleted) {
        throw new Error('Usuario no encontrado');
      }

      const user = users[0] as IUser;

      // Verificar contraseña
      const isPasswordValid = await this.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        // Intentar verificación con bcrypt como fallback
        try {
          const bcryptValid = await bcrypt.compare(password, user.password);
          if (!bcryptValid) {
            throw new Error('Contraseña incorrecta');
          }
        } catch (bcryptError) {
          throw new Error('Contraseña incorrecta');
        }
      }

      // Cerrar sesiones activas previas del usuario
      await this.closeUserActiveSessions(user.id!);

      // Crear nueva sesión
      const token = this.generateSessionToken();
      const now = new Date();
      
      const sessionData = {
        userId: user.id!,
        startDate: now,
        endDate: null,
        isActive: true,
        lastActivity: now,
        token: token
      };
      
      // Insertar sesión en Firestore
      const sessionId = await FirestoreService.create(this.SESSIONS_COLLECTION, sessionData);
      
      // Preparar respuesta con datos del usuario (sin contraseña)
      const userResponse = { ...user };
      delete (userResponse as any).password;
      
      return {
        user: userResponse as IUser,
        token,
        sessionId
      };
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validar sesión activa
   */
  static async validateSession(token: string): Promise<{ user: IUser; sessionId: string } | null> {
    try {
      if (!token) return null;

      // Buscar sesión por token
      const sessions = await FirestoreService.findBy(
        this.SESSIONS_COLLECTION,
        'token',
        '==',
        token
      );

      if (sessions.length === 0) {
        console.log('❌ Sesión no encontrada');
        return null;
      }

      const session = sessions[0] as ISession;

      // Verificar si la sesión está activa
      if (!session.isActive) {
        console.log('❌ Sesión inactiva');
        return null;
      }

      // Verificar timeout de inactividad
      const now = new Date();
      const lastActivity = new Date(session.lastActivity);
      const timeDiff = now.getTime() - lastActivity.getTime();

      if (timeDiff > this.SESSION_TIMEOUT) {
        console.log('❌ Sesión expirada por inactividad');
        await this.closeSession(session.id!);
        return null;
      }

      // Actualizar última actividad
      await this.updateSessionActivity(session.id!);

      // Obtener datos del usuario
      const user = await FirestoreService.readById(this.USERS_COLLECTION, session.userId) as IUser;
      
      if (!user || user.isDeleted) {
        console.log('❌ Usuario no encontrado o eliminado');
        await this.closeSession(session.id!);
        return null;
      }

      // No devolver la contraseña
      const userResponse = { ...user };
      delete (userResponse as any).password;

      // console.log('✅ Sesión válida para usuario:', user.email); // Reducir logs
      return {
        user: userResponse as IUser,
        sessionId: session.id!
      };
    } catch (error) {
      console.error('❌ Error validando sesión:', error);
      return null;
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(token: string): Promise<void> {
    try {
      const sessions = await FirestoreService.findBy(
        this.SESSIONS_COLLECTION,
        'token',
        '==',
        token
      );

      if (sessions.length > 0) {
        await this.closeSession(sessions[0].id!);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar actividad de sesión
   */
  private static async updateSessionActivity(sessionId: string): Promise<void> {
    await FirestoreService.update(this.SESSIONS_COLLECTION, sessionId, {
      lastActivity: new Date()
    });
  }

  /**
   * Cerrar una sesión específica
   */
  private static async closeSession(sessionId: string): Promise<void> {
    const endDate = new Date();
    
    await FirestoreService.update(this.SESSIONS_COLLECTION, sessionId, {
      isActive: false,
      endDate: endDate,
      updatedAt: endDate
    });
  }

  /**
   * Cerrar todas las sesiones activas de un usuario
   */
  private static async closeUserActiveSessions(userId: string): Promise<void> {
    const activeSessions = await FirestoreService.readAll(this.SESSIONS_COLLECTION, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isActive', operator: '==', value: true }
      ]
    });

    for (const session of activeSessions) {
      await this.closeSession(session.id!);
    }
  }

  /**
   * Limpiar sesiones expiradas (función de mantenimiento)
   */
  static async cleanExpiredSessions(): Promise<void> {
    try {
      const activeSessions = await FirestoreService.findBy(
        this.SESSIONS_COLLECTION,
        'isActive',
        '==',
        true
      );

      const now = new Date();
      let cleanedCount = 0;

      for (const session of activeSessions) {
        const lastActivity = new Date(session.lastActivity);
        const timeDiff = now.getTime() - lastActivity.getTime();

        if (timeDiff > this.SESSION_TIMEOUT) {
          await this.closeSession(session.id!);
          cleanedCount++;
        }
      }

      console.log(`🧹 Limpiadas ${cleanedCount} sesiones expiradas`);
    } catch (error) {
      console.error('❌ Error limpiando sesiones expiradas:', error);
    }
  }

  /**
   * Obtener estadísticas de sesiones (para debugging)
   */
  static async getSessionStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
  }> {
    try {
      const allSessions = await FirestoreService.readAll(this.SESSIONS_COLLECTION);
      const activeSessions = allSessions.filter(s => s.isActive);
      
      const now = new Date();
      const expiredSessions = activeSessions.filter(s => {
        const lastActivity = new Date(s.lastActivity);
        const timeDiff = now.getTime() - lastActivity.getTime();
        return timeDiff > this.SESSION_TIMEOUT;
      });

      return {
        totalSessions: allSessions.length,
        activeSessions: activeSessions.length - expiredSessions.length,
        expiredSessions: expiredSessions.length
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de sesiones:', error);
      return { totalSessions: 0, activeSessions: 0, expiredSessions: 0 };
    }
  }
}

export default AuthFirestoreService;
