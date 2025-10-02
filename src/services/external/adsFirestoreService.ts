import { FirestoreService } from './firestoreService';
import { IAd } from '../../interfaces/dtos/external/IFirestore';

export class AdsFirestoreService {
  private static readonly COLLECTION_NAME = 'ads';

  /**
   * Crear un nuevo anuncio
   */
  static async createAd(ad: Omit<IAd, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.create(this.COLLECTION_NAME, ad);
  }

  /**
   * Obtener un anuncio por ID
   */
  static async getAd(adId: string): Promise<IAd | null> {
    return FirestoreService.readById(this.COLLECTION_NAME, adId);
  }

  /**
   * Obtener todos los anuncios de un usuario
   */
  static async getUserAds(userId: string): Promise<IAd[]> {
    return FirestoreService.findBy(this.COLLECTION_NAME, 'userId', '==', userId);
  }

  /**
   * Obtener anuncios activos de un usuario
   */
  static async getActiveAds(userId: string): Promise<IAd[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * Obtener anuncios por estado
   */
  static async getAdsByStatus(userId: string, status: 'draft' | 'active' | 'archived'): Promise<IAd[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: status }
      ],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    });
  }

  /**
   * Actualizar un anuncio
   */
  static async updateAd(
    adId: string, 
    updates: Partial<Omit<IAd, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.COLLECTION_NAME, adId, updates);
  }

  /**
   * Eliminar un anuncio
   */
  static async deleteAd(adId: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION_NAME, adId);
  }

  /**
   * Cambiar el estado de un anuncio
   */
  static async updateAdStatus(
    adId: string, 
    status: 'draft' | 'active' | 'archived'
  ): Promise<void> {
    return this.updateAd(adId, { status });
  }

  /**
   * Buscar anuncios por título
   */
  static async searchAdsByTitle(userId: string, searchTerm: string): Promise<IAd[]> {
    // Firestore no tiene búsqueda de texto completo nativa
    // Esta es una implementación básica que busca coincidencias exactas
    const allAds = await this.getUserAds(userId);
    return allAds.filter(ad => 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Obtener anuncios por template
   */
  static async getAdsByTemplate(userId: string, template: string): Promise<IAd[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'template', operator: '==', value: template }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * Obtener anuncios por paleta de colores
   */
  static async getAdsByPalette(userId: string, palette: string): Promise<IAd[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'palette', operator: '==', value: palette }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * Obtener anuncios por tamaño
   */
  static async getAdsBySize(userId: string, size: string): Promise<IAd[]> {
    return FirestoreService.readAll(this.COLLECTION_NAME, {
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'size', operator: '==', value: size }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  /**
   * Obtener estadísticas de anuncios
   */
  static async getAdsStats(userId: string) {
    const ads = await this.getUserAds(userId);
    
    return {
      totalAds: ads.length,
      activeAds: ads.filter(ad => ad.status === 'active').length,
      draftAds: ads.filter(ad => ad.status === 'draft').length,
      archivedAds: ads.filter(ad => ad.status === 'archived').length,
      templateStats: this.getTemplateStats(ads),
      paletteStats: this.getPaletteStats(ads),
      sizeStats: this.getSizeStats(ads)
    };
  }

  /**
   * Estadísticas por template
   */
  private static getTemplateStats(ads: IAd[]) {
    const templateCounts: Record<string, number> = {};
    ads.forEach(ad => {
      templateCounts[ad.template] = (templateCounts[ad.template] || 0) + 1;
    });
    return templateCounts;
  }

  /**
   * Estadísticas por paleta
   */
  private static getPaletteStats(ads: IAd[]) {
    const paletteCounts: Record<string, number> = {};
    ads.forEach(ad => {
      paletteCounts[ad.palette] = (paletteCounts[ad.palette] || 0) + 1;
    });
    return paletteCounts;
  }

  /**
   * Estadísticas por tamaño
   */
  private static getSizeStats(ads: IAd[]) {
    const sizeCounts: Record<string, number> = {};
    ads.forEach(ad => {
      sizeCounts[ad.size] = (sizeCounts[ad.size] || 0) + 1;
    });
    return sizeCounts;
  }

  /**
   * Duplicar un anuncio
   */
  static async duplicateAd(adId: string, userId: string): Promise<string> {
    const originalAd = await this.getAd(adId);
    if (!originalAd) {
      throw new Error('Anuncio no encontrado');
    }

    // Crear copia sin id, createdAt, updatedAt
    const duplicatedAd: Omit<IAd, 'id' | 'createdAt' | 'updatedAt'> = {
      title: `${originalAd.title} (Copia)`,
      description: originalAd.description,
      content: { ...originalAd.content },
      template: originalAd.template,
      palette: originalAd.palette,
      size: originalAd.size,
      userId: userId,
      status: 'draft'
    };

    return this.createAd(duplicatedAd);
  }
}

export default AdsFirestoreService;
