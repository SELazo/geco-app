/**
 * Servicio para integración con OpenAI DALL-E
 * Permite generar imágenes usando IA a partir de prompts de texto
 */

export interface IGenerateImageRequest {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  n?: number; // Número de imágenes a generar (1-10)
}

export interface IGenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
}

class OpenAIService {
  private apiKey: string;
  private apiUrl: string = 'https://api.openai.com/v1/images/generations';

  constructor() {
    // Obtener API key desde variables de entorno
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ VITE_OPENAI_API_KEY no está configurada');
    }
  }

  /**
   * Genera una imagen usando DALL-E 3
   */
  async generateImage(request: IGenerateImageRequest): Promise<IGenerateImageResponse> {
    try {
      console.log('🎨 Generando imagen con IA...');
      console.log('🎨 Prompt:', request.prompt);

      if (!this.apiKey) {
        throw new Error('API Key de OpenAI no configurada. Agrega VITE_OPENAI_API_KEY en tu archivo .env');
      }

      // Validar tamaño
      const size = request.size || '1024x1024';
      
      // Preparar request para DALL-E 3
      const requestBody = {
        model: 'dall-e-3', // Usar DALL-E 3 (mejor calidad)
        prompt: request.prompt,
        n: 1, // DALL-E 3 solo permite 1 imagen por request
        size: size,
        quality: request.quality || 'standard', // 'standard' o 'hd'
        response_format: 'url' // Primero obtenemos URL
      };

      console.log('📤 Enviando request a OpenAI...');

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de OpenAI:', errorData);
        throw new Error(errorData.error?.message || 'Error al generar imagen');
      }

      const data = await response.json();
      console.log('✅ Imagen generada exitosamente');

      const imageUrl = data.data[0]?.url;

      if (!imageUrl) {
        throw new Error('No se recibió URL de imagen');
      }

      // Convertir URL a base64 para guardar en Firestore
      console.log('🔄 Convirtiendo imagen a base64...');
      const imageBase64 = await this.urlToBase64(imageUrl);

      return {
        success: true,
        imageUrl: imageUrl,
        imageBase64: imageBase64
      };

    } catch (error) {
      console.error('❌ Error al generar imagen:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Convierte una URL de imagen a base64
   */
  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
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
      console.error('❌ Error al convertir imagen a base64:', error);
      throw error;
    }
  }

  /**
   * Valida si la API key está configurada
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Mejora un prompt del usuario con sugerencias para publicidades
   */
  enhancePromptForAd(userPrompt: string): string {
    // Agregar contexto para que DALL-E genere imágenes apropiadas para publicidades
    return `Create a professional, high-quality advertising image: ${userPrompt}. The image should be vibrant, eye-catching, and suitable for marketing purposes. Focus on visual appeal and clarity.`;
  }
}

// Exportar instancia singleton
export const openAIService = new OpenAIService();
export default openAIService;
