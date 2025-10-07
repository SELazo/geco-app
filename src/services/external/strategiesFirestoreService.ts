import { FirestoreService } from './firestoreService';
import { IStrategy } from '../../interfaces/dtos/external/IFirestore';

export class StrategiesFirestoreService {
  private static readonly COLLECTION_NAME = 'strategies';

  /**
   * Crear una nueva estrategia
   */
  static async createStrategy(strategy: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.create(this.COLLECTION_NAME, strategy);
  }

  /**
   * Obtener una estrategia por ID
   */
  static async getStrategy(strategyId: string): Promise<IStrategy | null> {
    return FirestoreService.readById(this.COLLECTION_NAME, strategyId);
  }

  /**
   * Obtener todas las estrategias de un usuario
   */
  static async getUserStrategies(userId: string): Promise<IStrategy[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'userId', '==', userId);
  }

  /**
   * Obtener estrategias activas de un usuario
   */
  static async getActiveStrategies(userId: string): Promise<IStrategy[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * Actualizar una estrategia
   */
  static async updateStrategy(
    strategyId: string, 
    updates: Partial<Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.COLLECTION_NAME, strategyId, updates);
  }

  /**
   * Eliminar una estrategia
   */
  static async deleteStrategy(strategyId: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION_NAME, strategyId);
  }

  /**
   * Cambiar el estado de una estrategia
   */
  static async updateStrategyStatus(
    strategyId: string, 
    status: 'active' | 'paused' | 'completed' | 'draft'
  ): Promise<void> {
    return this.updateStrategy(strategyId, { status });
  }

  /**
   * Buscar estrategias por título
   */
  static async searchStrategiesByTitle(userId: string, searchTerm: string): Promise<IStrategy[]> {
    // Nota: Firestore no tiene búsqueda de texto completo nativa
    // Esta es una implementación básica que busca coincidencias exactas
    const allStrategies = await this.getUserStrategies(userId);
    return allStrategies.filter(strategy => 
      strategy.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Obtener estrategias por rango de fechas
   */
  static async getStrategiesByDateRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<IStrategy[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'startDate', operator: '>=', value: startDate },
        { field: 'endDate', operator: '<=', value: endDate }
      ],
      orderBy: [{ field: 'startDate', direction: 'asc' }]
    });
  }
}

export default StrategiesFirestoreService;
