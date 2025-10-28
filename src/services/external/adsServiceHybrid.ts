/**
 * Servicio híbrido de Publicidades
 * Combina Firestore para almacenamiento de datos con backend para generación de imágenes
 */

import { AdsFirestoreService } from './adsFirestoreService';
import { AdsService } from './adsService';
import { IAd as IAdFirestore } from '../../interfaces/dtos/external/IFirestore';
import { IAd as IAdBackend } from '../../interfaces/dtos/external/IAds';
import { compressBase64Image, getBase64SizeKB } from '../../utils/imageCompression';

export class AdsServiceHybrid {
  /**
   * Obtener anuncios del usuario desde Firestore
   */
  static async getUserAds(userId: string): Promise<IAdFirestore[]> {
    return AdsFirestoreService.getUserAds(userId);
  }

  /**
   * Obtener un anuncio por ID desde Firestore
   */
  static async getAd(adId: string): Promise<IAdFirestore | null> {
    return AdsFirestoreService.getAd(adId);
  }

  /**
   * Eliminar anuncio desde Firestore
   */
  static async deleteAd(adId: string): Promise<void> {
    return AdsFirestoreService.deleteAd(adId);
  }

  /**
   * Actualizar anuncio en Firestore
   */
  static async updateAd(
    adId: string,
    updates: Partial<Omit<IAdFirestore, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return AdsFirestoreService.updateAd(adId, updates);
  }

  /**
   * Crear anuncio nuevo:
   * Guarda todo en Firestore (metadatos + imagen base64)
   */
  static async createAdWithImage(
    adData: IAdBackend,
    base64Image: string,
    userId: string
  ): Promise<string> {
    try {
      console.log('📝 [AdsServiceHybrid] Creando publicidad en Firestore...');
      console.log('📝 [AdsServiceHybrid] userId:', userId);
      console.log('📝 [AdsServiceHybrid] adData:', adData);
      console.log('📝 [AdsServiceHybrid] base64Image length:', base64Image?.length || 0);
      
      // Validaciones
      if (!userId) {
        throw new Error('userId es requerido');
      }
      if (!adData) {
        throw new Error('adData es requerido');
      }
      if (!base64Image) {
        throw new Error('base64Image es requerido');
      }
      
      // Verificar tamaño de la imagen
      const originalSizeKB = getBase64SizeKB(base64Image);
      console.log('📏 [AdsServiceHybrid] Tamaño original de imagen:', originalSizeKB, 'KB');
      
      // Comprimir si es necesario (límite de Firestore: 1MB, usamos 700KB para mayor margen)
      let finalImage = base64Image;
      if (originalSizeKB > 700) {
        console.log('🗜️ [AdsServiceHybrid] Imagen supera 700KB, comprimiendo...');
        finalImage = await compressBase64Image(base64Image, 700, 0.8);
        const compressedSizeKB = getBase64SizeKB(finalImage);
        console.log('✅ [AdsServiceHybrid] Imagen comprimida:', compressedSizeKB, 'KB');
        console.log('✅ [AdsServiceHybrid] Reducción:', Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100), '%');
      } else {
        console.log('✅ [AdsServiceHybrid] Imagen dentro del límite, no se requiere compresión');
      }
      
      // Guardar todo en Firestore (imagen incluida)
      const firestoreAd: Omit<IAdFirestore, 'id' | 'createdAt' | 'updatedAt'> = {
        title: adData.title,
        description: adData.description || '',
        content: {
          titleAd: adData.title,
          textAd: adData.description,
          imageUrl: finalImage, // Guardar imagen (comprimida si era necesario)
        },
        template: adData.ad_template?.disposition_pattern || '',
        palette: adData.ad_template?.color_text || '',
        size: adData.size || '',
        userId: userId,
        status: 'active',
      };

      console.log('📝 [AdsServiceHybrid] Objeto a guardar:', {
        title: firestoreAd.title,
        userId: firestoreAd.userId,
        imageUrlLength: firestoreAd.content.imageUrl?.length || 0
      });

      console.log('📝 [AdsServiceHybrid] Llamando a AdsFirestoreService.createAd...');
      const firestoreId = await AdsFirestoreService.createAd(firestoreAd);
      console.log('✅ [AdsServiceHybrid] Publicidad creada con ID:', firestoreId);
      return firestoreId;
    } catch (error: any) {
      console.error('❌ [AdsServiceHybrid] Error en createAdWithImage:', error);
      console.error('❌ [AdsServiceHybrid] Error message:', error?.message);
      console.error('❌ [AdsServiceHybrid] Error stack:', error?.stack);
      throw error;
    }
  }

  /**
   * Obtener imagen del anuncio desde el backend
   * (Firestore solo tiene la referencia, la imagen está en el backend)
   */
  static async getAdImage(backendId: number): Promise<string> {
    return AdsService.getAdImg(backendId);
  }

  /**
   * Métodos estáticos que no necesitan cambios (datos locales)
   */
  static getAdColours = AdsService.getAdColours;
  static getAdSizes = AdsService.getAdSizes;
  static getAdPatterns = AdsService.getAdPatterns;

  /**
   * Obtener anuncios activos
   */
  static async getActiveAds(userId: string): Promise<IAdFirestore[]> {
    return AdsFirestoreService.getActiveAds(userId);
  }

  /**
   * Cambiar estado del anuncio
   */
  static async updateAdStatus(
    adId: string,
    status: 'draft' | 'active' | 'archived'
  ): Promise<void> {
    return AdsFirestoreService.updateAdStatus(adId, status);
  }

  /**
   * Buscar anuncios por título
   */
  static async searchAdsByTitle(userId: string, searchTerm: string): Promise<IAdFirestore[]> {
    return AdsFirestoreService.searchAdsByTitle(userId, searchTerm);
  }

  /**
   * Obtener estadísticas de anuncios
   */
  static async getAdsStats(userId: string) {
    return AdsFirestoreService.getAdsStats(userId);
  }

  /**
   * Duplicar anuncio
   */
  static async duplicateAd(adId: string, userId: string): Promise<string> {
    return AdsFirestoreService.duplicateAd(adId, userId);
  }
}

export default AdsServiceHybrid;
