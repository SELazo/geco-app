import { FirestoreService } from './firestoreService';
import { IFormSubmission } from '../../interfaces/dtos/external/IFirestore';

export class FormSubmissionsFirestoreService {
  private static readonly COLLECTION_NAME = 'form-submissions';

  /**
   * Crear un nuevo envío de formulario
   */
  static async createFormSubmission(
    submission: Omit<IFormSubmission, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    return FirestoreService.create(this.COLLECTION_NAME, submission);
  }

  /**
   * Obtener un envío de formulario por ID
   */
  static async getFormSubmission(submissionId: string): Promise<IFormSubmission | null> {
    return FirestoreService.readById(this.COLLECTION_NAME, submissionId);
  }

  /**
   * Obtener todos los envíos de formulario de una estrategia
   */
  static async getSubmissionsByStrategy(strategyId: string): Promise<IFormSubmission[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'strategyId', '==', strategyId);
  }

  /**
   * Obtener envíos de formulario por tipo
   */
  static async getSubmissionsByType(
    strategyId: string, 
    formType: string
  ): Promise<IFormSubmission[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'strategyId', operator: '==', value: strategyId },
        { field: 'formType', operator: '==', value: formType }
      ],
      orderBy: [{ field: 'submittedAt', direction: 'desc' }]
    });
  }

  /**
   * Obtener envíos de formulario pendientes de procesar
   */
  static async getPendingSubmissions(strategyId?: string): Promise<IFormSubmission[]> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'processed', operator: '==', value: false }
    ];

    if (strategyId) {
      whereConditions.push({ field: 'strategyId', operator: '==', value: strategyId });
    }

    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: whereConditions,
      orderBy: [{ field: 'submittedAt', direction: 'asc' }]
    });
  }

  /**
   * Obtener envíos de formulario procesados
   */
  static async getProcessedSubmissions(strategyId?: string): Promise<IFormSubmission[]> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'processed', operator: '==', value: true }
    ];

    if (strategyId) {
      whereConditions.push({ field: 'strategyId', operator: '==', value: strategyId });
    }

    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: whereConditions,
      orderBy: [{ field: 'submittedAt', direction: 'desc' }]
    });
  }

  /**
   * Actualizar un envío de formulario
   */
  static async updateFormSubmission(
    submissionId: string,
    updates: Partial<Omit<IFormSubmission, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.COLLECTION_NAME, submissionId, updates);
  }

  /**
   * Marcar envío como procesado
   */
  static async markAsProcessed(submissionId: string): Promise<void> {
    return this.updateFormSubmission(submissionId, { processed: true });
  }

  /**
   * Marcar envío como no procesado
   */
  static async markAsUnprocessed(submissionId: string): Promise<void> {
    return this.updateFormSubmission(submissionId, { processed: false });
  }

  /**
   * Eliminar un envío de formulario
   */
  static async deleteFormSubmission(submissionId: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION_NAME, submissionId);
  }

  /**
   * Obtener envíos por rango de fechas
   */
  static async getSubmissionsByDateRange(
    strategyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IFormSubmission[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'strategyId', operator: '==', value: strategyId },
        { field: 'submittedAt', operator: '>=', value: startDate },
        { field: 'submittedAt', operator: '<=', value: endDate }
      ],
      orderBy: [{ field: 'submittedAt', direction: 'desc' }]
    });
  }

  /**
   * Buscar envíos por información de contacto
   */
  static async searchSubmissionsByContact(
    strategyId: string,
    searchTerm: string
  ): Promise<IFormSubmission[]> {
    // Firestore no tiene búsqueda de texto completo nativa
    // Esta es una implementación básica que busca coincidencias exactas
    const allSubmissions = await this.getSubmissionsByStrategy(strategyId);
    return allSubmissions.filter(submission => {
      const contactInfo = submission.contactInfo;
      if (!contactInfo) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (contactInfo.name && contactInfo.name.toLowerCase().includes(searchLower)) ||
        (contactInfo.email && contactInfo.email.toLowerCase().includes(searchLower)) ||
        (contactInfo.phone && contactInfo.phone.toLowerCase().includes(searchLower))
      );
    });
  }

  /**
   * Obtener estadísticas de envíos de formulario
   */
  static async getSubmissionsStats(strategyId: string) {
    const submissions = await this.getSubmissionsByStrategy(strategyId);
    
    const stats = {
      totalSubmissions: submissions.length,
      processedSubmissions: submissions.filter(s => s.processed).length,
      pendingSubmissions: submissions.filter(s => !s.processed).length,
      submissionsByType: this.getSubmissionsByTypeStats(submissions),
      submissionsByDate: this.getSubmissionsByDateStats(submissions),
      contactsWithEmail: submissions.filter(s => s.contactInfo?.email).length,
      contactsWithPhone: submissions.filter(s => s.contactInfo?.phone).length,
      contactsWithName: submissions.filter(s => s.contactInfo?.name).length
    };

    return stats;
  }

  /**
   * Estadísticas por tipo de formulario
   */
  private static getSubmissionsByTypeStats(submissions: IFormSubmission[]) {
    const typeCounts: Record<string, number> = {};
    submissions.forEach(submission => {
      typeCounts[submission.formType] = (typeCounts[submission.formType] || 0) + 1;
    });
    return typeCounts;
  }

  /**
   * Estadísticas por fecha (últimos 30 días)
   */
  private static getSubmissionsByDateStats(submissions: IFormSubmission[]) {
    const dateStats: Record<string, number> = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    submissions
      .filter(s => s.submittedAt >= thirtyDaysAgo)
      .forEach(submission => {
        const dateKey = submission.submittedAt.toISOString().split('T')[0]; // YYYY-MM-DD
        dateStats[dateKey] = (dateStats[dateKey] || 0) + 1;
      });

    return dateStats;
  }

  /**
   * Obtener envíos recientes (últimas 24 horas)
   */
  static async getRecentSubmissions(strategyId?: string): Promise<IFormSubmission[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'submittedAt', operator: '>=', value: yesterday }
    ];

    if (strategyId) {
      whereConditions.push({ field: 'strategyId', operator: '==', value: strategyId });
    }

    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: whereConditions,
      orderBy: [{ field: 'submittedAt', direction: 'desc' }],
      limit: 50
    });
  }

  /**
   * Exportar envíos de formulario a formato CSV
   */
  static async exportSubmissionsToCSV(strategyId: string): Promise<string> {
    const submissions = await this.getSubmissionsByStrategy(strategyId);
    
    if (submissions.length === 0) {
      return 'No hay envíos para exportar';
    }

    // Crear headers CSV
    const headers = [
      'ID',
      'Tipo de Formulario',
      'Fecha de Envío',
      'Procesado',
      'Nombre',
      'Email',
      'Teléfono',
      'Datos del Formulario'
    ];

    // Crear filas CSV
    const rows = submissions.map(submission => [
      submission.id || '',
      submission.formType,
      submission.submittedAt.toISOString(),
      submission.processed ? 'Sí' : 'No',
      submission.contactInfo?.name || '',
      submission.contactInfo?.email || '',
      submission.contactInfo?.phone || '',
      JSON.stringify(submission.data)
    ]);

    // Combinar headers y rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export default FormSubmissionsFirestoreService;
