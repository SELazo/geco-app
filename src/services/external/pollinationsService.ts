/**
 * Servicio para integración con Pollinations.ai
 * API GRATUITA de generación de imágenes con IA
 * NO requiere API Key ni registro
 */

export interface IGenerateImageRequest {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  n?: number; // Para compatibilidad (Pollinations siempre genera 1)
}

export interface IGenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
}

class PollinationsService {
  private baseUrl: string = 'https://image.pollinations.ai/prompt';

  /**
   * Genera una imagen usando Pollinations.ai
   * ✅ Completamente GRATIS
   * ✅ Sin API Key
   * ✅ Sin límites
   */
  async generateImage(
    request: IGenerateImageRequest
  ): Promise<IGenerateImageResponse> {
    try {
      console.log('🎨 Generando imagen con Pollinations.ai...');
      console.log('🎨 Prompt:', request.prompt);

      // Mejorar el prompt para mejores resultados
      const enhancedPrompt = this.enhancePromptForAd(request.prompt);
      console.log('✨ Prompt mejorado:', enhancedPrompt);

      // Parsear tamaño
      const [width, height] = this.parseSize(request.size || '1024x1024');

      // Construir URL de Pollinations
      // Parámetros:
      // - width/height: Tamaño de imagen
      // - nologo: Sin marca de agua
      // - enhance: Mejor calidad
      // - model: turbo (más rápido) o flux (mejor calidad)
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      const imageUrl = `${this.baseUrl}/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true&model=turbo`;

      console.log('📤 Solicitando imagen a Pollinations.ai...');
      console.log('🔗 URL:', imageUrl.substring(0, 100) + '...');

      // La imagen se genera automáticamente al acceder a la URL
      // No hay API de respuesta, la URL ES la imagen

      // Descargar la imagen y convertir a base64
      console.log('📥 Descargando imagen...');
      const imageBase64 = await this.urlToBase64(imageUrl);

      console.log('✅ Imagen generada exitosamente');
      console.log('✅ Tamaño base64:', imageBase64.length, 'caracteres');

      return {
        success: true,
        imageUrl: imageUrl,
        imageBase64: imageBase64,
      };
    } catch (error) {
      console.error('❌ Error al generar imagen:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error desconocido al generar imagen',
      };
    }
  }

  /**
   * Convierte una URL de imagen a base64
   */
  private async urlToBase64(url: string): Promise<string> {
    try {
      // Intentar hasta 3 veces (Pollinations a veces tarda en generar)
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();

          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`⏳ Reintento ${attempts}/${maxAttempts}...`);
            await this.sleep(2000); // Esperar 2 segundos antes de reintentar
          } else {
            throw error;
          }
        }
      }

      throw new Error(
        'No se pudo descargar la imagen después de varios intentos'
      );
    } catch (error) {
      console.error('❌ Error al convertir imagen a base64:', error);
      throw new Error(
        'No se pudo convertir la imagen. Por favor, intenta de nuevo.'
      );
    }
  }

  /**
   * Parsea el tamaño en formato "WIDTHxHEIGHT"
   */
  private parseSize(size: string): [number, number] {
    const [width, height] = size.split('x').map(Number);
    return [width || 1024, height || 1024];
  }

  /**
   * Mejora un prompt del usuario con sugerencias para publicidades
   */
  enhancePromptForAd(userPrompt: string): string {
    // Agregar contexto para generar imágenes apropiadas para publicidades
    // Pollinations funciona mejor con prompts en inglés, pero acepta español también
    return `Professional advertising image, high quality, commercial photography: ${userPrompt}. Vibrant colors, eye-catching composition, marketing-ready, clean and modern aesthetic.`;
  }

  /**
   * Valida si el servicio está configurado (siempre true para Pollinations)
   */
  isConfigured(): boolean {
    // Pollinations NO requiere API Key, siempre está disponible
    return true;
  }

  /**
   * Utilidad para esperar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Exportar instancia singleton
export const pollinationsService = new PollinationsService();
export default pollinationsService;
