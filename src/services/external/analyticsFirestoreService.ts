import { FirestoreService } from './firestoreService';
import { IAnalytics } from '../../interfaces/dtos/external/IFirestore';

export class AnalyticsFirestoreService {
  private static readonly COLLECTION_NAME = 'analytics';

  /**
   * Crear un nuevo registro de analytics
   */
  static async createAnalyticsRecord(
    analytics: Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    return FirestoreService.create(this.COLLECTION_NAME, analytics);
  }

  /**
   * Obtener un registro de analytics por ID
   */
  static async getAnalyticsRecord(analyticsId: string): Promise<IAnalytics | null> {
    return FirestoreService.readById(this.COLLECTION_NAME, analyticsId);
  }

  /**
   * Obtener todos los registros de analytics de un usuario
   */
  static async getUserAnalytics(userId: string): Promise<IAnalytics[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'userId', '==', userId);
  }

  /**
   * Obtener analytics por estrategia
   */
  static async getAnalyticsByStrategy(strategyId: string): Promise<IAnalytics[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'strategyId', '==', strategyId);
  }

  /**
   * Obtener analytics por anuncio
   */
  static async getAnalyticsByAd(adId: string): Promise<IAnalytics[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'adId', '==', adId);
  }

  /**
   * Obtener analytics por tipo de evento
   */
  static async getAnalyticsByType(
    userId: string,
    type: 'view' | 'click' | 'conversion' | 'form_submission'
  ): Promise<IAnalytics[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'type', operator: '==', value: type }
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    });
  }

  /**
   * Obtener analytics por rango de fechas
   */
  static async getAnalyticsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IAnalytics[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'timestamp', operator: '>=', value: startDate },
        { field: 'timestamp', operator: '<=', value: endDate }
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    });
  }

  /**
   * Obtener analytics de una estrategia por rango de fechas
   */
  static async getStrategyAnalyticsByDateRange(
    strategyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IAnalytics[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'strategyId', operator: '==', value: strategyId },
        { field: 'timestamp', operator: '>=', value: startDate },
        { field: 'timestamp', operator: '<=', value: endDate }
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    });
  }

  /**
   * Actualizar un registro de analytics
   */
  static async updateAnalyticsRecord(
    analyticsId: string,
    updates: Partial<Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.COLLECTION_NAME, analyticsId, updates);
  }

  /**
   * Eliminar un registro de analytics
   */
  static async deleteAnalyticsRecord(analyticsId: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION_NAME, analyticsId);
  }

  /**
   * Registrar una vista (view)
   */
  static async recordView(
    userId: string,
    strategyId?: string,
    adId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return this.createAnalyticsRecord({
      type: 'view',
      timestamp: new Date(),
      userId,
      strategyId,
      adId,
      metadata
    });
  }

  /**
   * Registrar un clic (click)
   */
  static async recordClick(
    userId: string,
    strategyId?: string,
    adId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return this.createAnalyticsRecord({
      type: 'click',
      timestamp: new Date(),
      userId,
      strategyId,
      adId,
      metadata
    });
  }

  /**
   * Registrar una conversión
   */
  static async recordConversion(
    userId: string,
    strategyId?: string,
    adId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return this.createAnalyticsRecord({
      type: 'conversion',
      timestamp: new Date(),
      userId,
      strategyId,
      adId,
      metadata
    });
  }

  /**
   * Registrar un envío de formulario
   */
  static async recordFormSubmission(
    userId: string,
    strategyId?: string,
    adId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return this.createAnalyticsRecord({
      type: 'form_submission',
      timestamp: new Date(),
      userId,
      strategyId,
      adId,
      metadata
    });
  }

  /**
   * Obtener estadísticas generales de un usuario
   */
  static async getUserStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await this.getAnalyticsByDateRange(userId, startDate, new Date());
    
    return {
      totalEvents: analytics.length,
      views: analytics.filter(a => a.type === 'view').length,
      clicks: analytics.filter(a => a.type === 'click').length,
      conversions: analytics.filter(a => a.type === 'conversion').length,
      formSubmissions: analytics.filter(a => a.type === 'form_submission').length,
      clickThroughRate: this.calculateCTR(analytics),
      conversionRate: this.calculateConversionRate(analytics),
      eventsByDay: this.getEventsByDay(analytics),
      eventsByType: this.getEventsByType(analytics),
      topStrategies: await this.getTopStrategies(analytics),
      topAds: await this.getTopAds(analytics)
    };
  }

  /**
   * Obtener estadísticas de una estrategia específica
   */
  static async getStrategyStats(strategyId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await this.getStrategyAnalyticsByDateRange(strategyId, startDate, new Date());
    
    return {
      totalEvents: analytics.length,
      views: analytics.filter(a => a.type === 'view').length,
      clicks: analytics.filter(a => a.type === 'click').length,
      conversions: analytics.filter(a => a.type === 'conversion').length,
      formSubmissions: analytics.filter(a => a.type === 'form_submission').length,
      clickThroughRate: this.calculateCTR(analytics),
      conversionRate: this.calculateConversionRate(analytics),
      eventsByDay: this.getEventsByDay(analytics),
      eventsByHour: this.getEventsByHour(analytics),
      adPerformance: this.getAdPerformance(analytics)
    };
  }

  /**
   * Calcular Click Through Rate (CTR)
   */
  private static calculateCTR(analytics: IAnalytics[]): number {
    const views = analytics.filter(a => a.type === 'view').length;
    const clicks = analytics.filter(a => a.type === 'click').length;
    return views > 0 ? (clicks / views) * 100 : 0;
  }

  /**
   * Calcular tasa de conversión
   */
  private static calculateConversionRate(analytics: IAnalytics[]): number {
    const clicks = analytics.filter(a => a.type === 'click').length;
    const conversions = analytics.filter(a => a.type === 'conversion').length;
    return clicks > 0 ? (conversions / clicks) * 100 : 0;
  }

  /**
   * Obtener eventos por día
   */
  private static getEventsByDay(analytics: IAnalytics[]) {
    const eventsByDay: Record<string, number> = {};
    analytics.forEach(event => {
      const day = event.timestamp.toISOString().split('T')[0];
      eventsByDay[day] = (eventsByDay[day] || 0) + 1;
    });
    return eventsByDay;
  }

  /**
   * Obtener eventos por hora
   */
  private static getEventsByHour(analytics: IAnalytics[]) {
    const eventsByHour: Record<number, number> = {};
    analytics.forEach(event => {
      const hour = event.timestamp.getHours();
      eventsByHour[hour] = (eventsByHour[hour] || 0) + 1;
    });
    return eventsByHour;
  }

  /**
   * Obtener eventos por tipo
   */
  private static getEventsByType(analytics: IAnalytics[]) {
    const eventsByType: Record<string, number> = {};
    analytics.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    });
    return eventsByType;
  }

  /**
   * Obtener top estrategias por rendimiento
   */
  private static getTopStrategies(analytics: IAnalytics[]) {
    const strategyStats: Record<string, number> = {};
    analytics
      .filter(a => a.strategyId)
      .forEach(event => {
        strategyStats[event.strategyId!] = (strategyStats[event.strategyId!] || 0) + 1;
      });
    
    return Object.entries(strategyStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([strategyId, count]) => ({ strategyId, eventCount: count }));
  }

  /**
   * Obtener top anuncios por rendimiento
   */
  private static getTopAds(analytics: IAnalytics[]) {
    const adStats: Record<string, number> = {};
    analytics
      .filter(a => a.adId)
      .forEach(event => {
        adStats[event.adId!] = (adStats[event.adId!] || 0) + 1;
      });
    
    return Object.entries(adStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([adId, count]) => ({ adId, eventCount: count }));
  }

  /**
   * Obtener rendimiento de anuncios para una estrategia
   */
  private static getAdPerformance(analytics: IAnalytics[]) {
    const adPerformance: Record<string, {
      views: number;
      clicks: number;
      conversions: number;
      formSubmissions: number;
    }> = {};

    analytics
      .filter(a => a.adId)
      .forEach(event => {
        const adId = event.adId!;
        if (!adPerformance[adId]) {
          adPerformance[adId] = { views: 0, clicks: 0, conversions: 0, formSubmissions: 0 };
        }
        
        switch (event.type) {
          case 'view':
            adPerformance[adId].views++;
            break;
          case 'click':
            adPerformance[adId].clicks++;
            break;
          case 'conversion':
            adPerformance[adId].conversions++;
            break;
          case 'form_submission':
            adPerformance[adId].formSubmissions++;
            break;
        }
      });

    return adPerformance;
  }

  /**
   * Limpiar registros antiguos (más de X días)
   */
  static async cleanOldRecords(userId: string, daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldRecords = await FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'timestamp', operator: '<', value: cutoffDate }
      ]
    });

    let deletedCount = 0;
    for (const record of oldRecords) {
      try {
        await this.deleteAnalyticsRecord(record.id!);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting analytics record ${record.id}:`, error);
      }
    }

    return deletedCount;
  }
}

export default AnalyticsFirestoreService;
