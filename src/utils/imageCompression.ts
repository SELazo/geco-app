/**
 * Utilidades para comprimir imágenes base64
 * Firestore tiene límite de 1MB por documento
 */

/**
 * Comprime una imagen base64 reduciendo su calidad
 * @param base64Image - Imagen en formato base64 (con o sin prefijo data:image)
 * @param maxSizeKB - Tamaño máximo en KB (default: 800KB para dejar margen)
 * @param quality - Calidad inicial (0-1, default: 0.8)
 * @returns Imagen comprimida en base64
 */
export async function compressBase64Image(
  base64Image: string,
  maxSizeKB: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log('🗜️ Iniciando compresión de imagen...');
      console.log('🗜️ Tamaño original:', Math.round(base64Image.length / 1024), 'KB');
      
      // Crear imagen
      const img = new Image();
      
      img.onload = () => {
        try {
          // Crear canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('No se pudo crear contexto de canvas'));
            return;
          }
          
          // Mantener proporciones
          let width = img.width;
          let height = img.height;
          
          // Calcular tamaño estimado en bytes (base64 es ~1.37x el tamaño real)
          const currentSizeKB = (base64Image.length * 0.75) / 1024;
          
          // Si es mayor al máximo, reducir dimensiones
          if (currentSizeKB > maxSizeKB) {
            const ratio = Math.sqrt(maxSizeKB / currentSizeKB);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            console.log('🗜️ Redimensionando a:', width, 'x', height);
          }
          
          // Configurar canvas
          canvas.width = width;
          canvas.height = height;
          
          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Intentar comprimir iterativamente
          let currentQuality = quality;
          let compressed = canvas.toDataURL('image/jpeg', currentQuality);
          let attempts = 0;
          const maxAttempts = 10;
          
          // Reducir calidad hasta que sea menor al tamaño máximo
          while (
            (compressed.length * 0.75) / 1024 > maxSizeKB && 
            currentQuality > 0.05 && 
            attempts < maxAttempts
          ) {
            currentQuality -= 0.05;
            compressed = canvas.toDataURL('image/jpeg', currentQuality);
            attempts++;
            console.log(
              `🗜️ Intento ${attempts}: calidad ${currentQuality.toFixed(2)}, tamaño ${Math.round((compressed.length * 0.75) / 1024)} KB`
            );
          }
          
          const finalSizeKB = Math.round((compressed.length * 0.75) / 1024);
          console.log('✅ Compresión completa:', finalSizeKB, 'KB');
          console.log('✅ Calidad final:', currentQuality.toFixed(2));
          console.log('✅ Reducción:', Math.round(((base64Image.length - compressed.length) / base64Image.length) * 100), '%');
          
          if (finalSizeKB > maxSizeKB) {
            console.warn('⚠️ Imagen aún supera el tamaño máximo, pero es lo mejor posible');
          }
          
          resolve(compressed);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para compresión'));
      };
      
      // Cargar imagen
      img.src = base64Image;
      
    } catch (error) {
      console.error('❌ Error en compresión:', error);
      reject(error);
    }
  });
}

/**
 * Obtiene el tamaño de una imagen base64 en KB
 */
export function getBase64SizeKB(base64: string): number {
  return Math.round((base64.length * 0.75) / 1024);
}

/**
 * Verifica si una imagen base64 excede el límite de Firestore
 */
export function exceedsFirestoreLimit(base64: string, limitKB: number = 1000): boolean {
  return getBase64SizeKB(base64) > limitKB;
}
