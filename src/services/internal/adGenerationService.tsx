import html2canvas from 'html2canvas';
import { INewAd } from '../../interfaces/dtos/external/IAds';
import Image from 'image-js';
import logoGeco from '../../assets/images/logo_geco.svg';

export const AdGenerationService = {
  // Configuración global simple para contraste
  _contrastConfig: {
    forceBrandColor: false,
    threshold: 4.5, // WCAG AA por defecto
  },
  setContrastOptions(
    opts: Partial<{ forceBrandColor: boolean; threshold: number }>
  ) {
    this._contrastConfig = { ...this._contrastConfig, ...opts };
  },
  getContrastOptions() {
    return this._contrastConfig;
  },
  async generation(
    props: INewAd,
    options?: {
      scale?: number;
      textAlign?: 'left' | 'center';
      titleWeight?: number;
      textWeight?: number;
      forceBrandColor?: boolean;
      overrideThreshold?: number;
    }
  ): Promise<string> {
    const bgUrl = this.resolveBackgroundUrl(props.img);

    const imageStyle: React.CSSProperties = {
      position: 'relative',
      backgroundImage: `url(${bgUrl})`,
      width: props.template.width,
      height: props.template.height,
      padding: props.template.padding,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '12px',
      overflow: 'hidden',
    };

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';

    const adDiv = document.createElement('div');
    Object.assign(adDiv.style, imageStyle);
    hiddenContainer.appendChild(adDiv);

    // Determinar opacidad del overlay según brillo estimado del fondo
    const brightness = await this.estimateBackgroundBrightness(props.img);
    const overlayAlpha =
      brightness > 0.6 ? 0.28 : brightness > 0.4 ? 0.22 : 0.16;

    // Overlay sutil para mejorar contraste del texto
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,${overlayAlpha}) 100%)`,
      pointerEvents: 'none',
    } as React.CSSProperties);
    adDiv.appendChild(overlay);

    // Determinar color final con auto-contraste
    const brandHex = this.resolveBrandHex(props.pallette);
    const bgLum = brightness; // 0..1
    const cfg = this.getContrastOptions();
    const forceBrandColor = options?.forceBrandColor ?? cfg.forceBrandColor;
    const threshold = options?.overrideThreshold ?? cfg.threshold;
    const brandLum = this.relativeLuminanceFromHex(brandHex);
    const contrastWithBrand = this.contrastRatio(brandLum, bgLum);
    const meetsContrast = contrastWithBrand >= (threshold ?? 4.5);
    const fallbackColor = bgLum > 0.5 ? '#18191F' : '#FFFFFF'; // negro sobre fondo claro, blanco sobre fondo oscuro
    
    // Si hay colores personalizados, usarlos; sino aplicar la lógica de contraste
    const titleFinalColor = props.titleColor 
      ? props.titleColor 
      : forceBrandColor
      ? brandHex
      : meetsContrast
      ? brandHex
      : fallbackColor;
    const bodyFinalColor = props.textColor
      ? props.textColor
      : forceBrandColor
      ? brandHex
      : meetsContrast
      ? brandHex
      : fallbackColor;

    if (props.titleAd) {
      const titleColor = titleFinalColor;
      const titlePositioning = this.getElementPositioning(
        props.template.titleDisposition
      );
      const titleStyle: React.CSSProperties = {
        position: 'absolute',
        ...titlePositioning,
        color: titleColor,
        fontFamily: 'Montserrat, Arial, sans-serif',
        fontStyle: 'normal',
        fontWeight: options?.titleWeight ?? 900,
        padding: '16px 20px',
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.18)',
        borderRadius: '10px',
        fontSize: props.template.titleSize,
        lineHeight: '1.1',
        letterSpacing: '-0.5px',
        width: props.template.titleWidth,
        maxWidth: props.template.titleWidth,
        textAlign: this.getTextAlign(props.template.titleDisposition),
        overflowWrap: 'break-word',
        textShadow: `0 2px 10px ${this.hexToRgba(brandHex, 0.35)}`,
      };
      const titleH1 = document.createElement('h1');
      titleH1.textContent = props.titleAd;
      Object.assign(titleH1.style, titleStyle);
      // Auto-resize para que el título no desborde
      this.autoResizeText(titleH1, parseInt(props.template.titleSize), 18);
      adDiv.appendChild(titleH1);
    }

    if (props.textAd) {
      const bodyColor = bodyFinalColor;
      const textPositioning = this.getElementPositioning(
        props.template.textDispostion
      );
      const textStyle: React.CSSProperties = {
        position: 'absolute',
        ...textPositioning,
        color: bodyColor,
        fontFamily: 'Montserrat, Arial, sans-serif',
        fontStyle: 'normal',
        fontWeight: options?.textWeight ?? 600,
        padding: '14px 18px',
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.18)',
        borderRadius: '10px',
        fontSize: props.template.textSize,
        lineHeight: '1.25',
        width: props.template.textWidth,
        maxWidth: props.template.textWidth,
        textAlign: this.getTextAlign(props.template.textDispostion),
        overflowWrap: 'break-word',
        textShadow: `0 2px 8px ${this.hexToRgba(brandHex, 0.3)}`,
      };
      const textP = document.createElement('p');
      textP.textContent = props.textAd;
      Object.assign(textP.style, textStyle);
      // Auto-resize para que el texto no desborde
      this.autoResizeText(textP, parseInt(props.template.textSize), 14);
      adDiv.appendChild(textP);
    }

    // Marca de agua GECo (logo)
    try {
      const watermarkWrapper = document.createElement('div');
      const w = Number.parseInt(props.template.width);
      const sizePx = isNaN(w) ? 120 : Math.max(72, Math.round(w * 0.12));
      Object.assign(watermarkWrapper.style, {
        position: 'absolute',
        right: '16px',
        bottom: '16px',
        opacity: '0.25',
        filter: 'grayscale(0.1)',
        pointerEvents: 'none',
      } as React.CSSProperties);
      const watermarkImg = document.createElement('img');
      watermarkImg.src = logoGeco;
      Object.assign(watermarkImg.style, {
        width: `${sizePx}px`,
        height: 'auto',
        display: 'block',
      } as React.CSSProperties);
      watermarkWrapper.appendChild(watermarkImg);
      adDiv.appendChild(watermarkWrapper);
    } catch (e) {
      // si falla, seguir sin watermark
    }

    document.body.appendChild(hiddenContainer);
    const scale = options?.scale ?? 2;
    const canvas = await html2canvas(adDiv, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false, // Reducir logs
      backgroundColor: null,
    });
    let dataURL = canvas.toDataURL('image/jpg');

    document.body.removeChild(hiddenContainer);

    const blob = await fetch(dataURL).then((r) => r.blob());
    const buffer = await blob.arrayBuffer();

    const image = await Image.load(buffer);

    const resizedImage = image.resize({
      width: Number.parseInt(props.template.width),
      height: Number.parseInt(props.template.height),
    });

    return resizedImage.toDataURL();
  },
  async assessContrast(
    props: INewAd,
    threshold?: number
  ): Promise<{
    meets: boolean;
    bgLum: number;
    brandLum: number;
    contrast: number;
    fallback: string;
  }> {
    const brightness = await this.estimateBackgroundBrightness(props.img);
    const brandHex = this.resolveBrandHex(props.pallette);
    const brandLum = this.relativeLuminanceFromHex(brandHex);
    const contrast = this.contrastRatio(brandLum, brightness);
    const meets = contrast >= (threshold ?? this._contrastConfig.threshold);
    const fallback = brightness > 0.5 ? '#18191F' : '#FFFFFF';
    return { meets, bgLum: brightness, brandLum, contrast, fallback };
  },
  resolveBrandHex(pallette: any): string {
    if (typeof pallette === 'string') return pallette;
    if (pallette && typeof pallette === 'object') {
      if (typeof pallette.hex === 'string') return pallette.hex;
      if (typeof pallette.color === 'string') return pallette.color;
    }
    return '#FFFFFF';
  },
  async generationAdjustedPair(
    props: INewAd
  ): Promise<{ brand: string; adjusted: string }> {
    const brand = await this.generation(props, {
      scale: 2,
      forceBrandColor: true,
    });
    const adjusted = await this.generation(props, {
      scale: 2,
      forceBrandColor: false,
    });
    return { brand, adjusted };
  },
  // Utils de color y contraste
  relativeLuminanceFromHex(hex: string): number {
    const { r, g, b } = this.hexToRgb(hex);
    const srgb = [r, g, b]
      .map((v) => v / 255)
      .map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  },
  contrastRatio(l1: number, l2: number): number {
    const L1 = Math.max(l1, l2);
    const L2 = Math.min(l1, l2);
    return (L1 + 0.05) / (L2 + 0.05);
  },
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    const full =
      clean.length === 3
        ? clean
            .split('')
            .map((c) => c + c)
            .join('')
        : clean;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  },
  hexToRgba(hex: string, alpha: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  async generationVariants(
    props: INewAd,
    options?: { scale?: number }
  ): Promise<string[]> {
    // 3 variantes más distintas entre sí
    const variants: Array<{
      titleWeight?: number;
      textWeight?: number;
      usePaletteText?: boolean;
      textAlign?: 'left' | 'center';
    }> = [
      // Variante 1: clásica, blanco sobre overlay suave, centrado
      {
        titleWeight: 900,
        textWeight: 600,
        usePaletteText: false,
        textAlign: 'center',
      },
      // Variante 2: colores de marca (paleta) como color de texto y overlay más fuerte, centrado
      {
        titleWeight: 800,
        textWeight: 500,
        usePaletteText: true,
        textAlign: 'center',
      },
      // Variante 3: alineación izquierda, más contraste
      {
        titleWeight: 900,
        textWeight: 700,
        usePaletteText: false,
        textAlign: 'left',
      },
    ];

    const results: string[] = [];
    for (const v of variants) {
      const img = await this.generation(
        { ...props },
        { scale: options?.scale ?? 2, ...v }
      );
      results.push(img);
    }
    return results;
  },
  resolveBackgroundUrl(img: File | string): string {
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'string') {
      // si ya es base64 o url absoluta/relativa, devolver tal cual
      return img;
    }
    return '';
  },
  async estimateBackgroundBrightness(img: File | string): Promise<number> {
    try {
      let buffer: ArrayBuffer | null = null;

      if (img instanceof File) {
        buffer = await img.arrayBuffer();
      } else if (typeof img === 'string') {
        // Si es base64, convertirlo directamente
        if (img.startsWith('data:image')) {
          try {
            const base64Data = img.split(',')[1];
            if (!base64Data) {
              console.warn('Base64 inválido, usando brillo por defecto');
              return 0.5;
            }
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            buffer = bytes.buffer;
          } catch (e) {
            console.error('Error decodificando base64:', e);
            return 0.5;
          }
        } else {
          // Si es una URL, hacer fetch
          try {
            const res = await fetch(img);
            if (!res.ok) {
              console.warn('Error fetching image, usando brillo por defecto');
              return 0.5;
            }
            const blob = await res.blob();
            buffer = await blob.arrayBuffer();
          } catch (e) {
            console.error('Error cargando imagen desde URL:', e);
            return 0.5;
          }
        }
      }

      if (!buffer || buffer.byteLength === 0) {
        console.warn('Buffer vacío, usando brillo por defecto');
        return 0.5;
      }

      const image = await Image.load(buffer);

      // Downscale for performance
      const small = image.resize({ width: 32 });
      let total = 0;
      const data: Uint8Array = (small as any).data as Uint8Array;

      if (!data || data.length === 0) {
        console.warn('Datos de imagen vacíos, usando brillo por defecto');
        return 0.5;
      }

      for (let i = 0; i < data.length; i += 4) {
        const r: number = data[i];
        const g: number = data[i + 1];
        const b: number = data[i + 2];
        // Perceived luminance
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        total += lum;
      }
      const brightness = total / (data.length / 4);
      return brightness; // 0..1
    } catch (error) {
      console.error('Error estimando brillo de imagen:', error);
      // Retornar valor por defecto en lugar de fallar
      return 0.5;
    }
  },
  autoResizeText(
    el: HTMLElement,
    baseFontSizePx: number,
    minFontSizePx: number
  ): void {
    const maxHeight = el.clientHeight || 10000;
    el.style.maxHeight = `${maxHeight}px`;
    el.style.overflow = 'hidden';
    let size = baseFontSizePx;
    el.style.fontSize = `${size}px`;
    // Iterar hasta que quepa o llegue a mínimo
    for (let i = 0; i < 20; i++) {
      if (el.scrollHeight <= el.clientHeight || size <= minFontSizePx) break;
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  },
  getJustifyContent(titleDisposition: string, textDispostion: string): string {
    if (titleDisposition === 'center' && textDispostion === 'center') {
      return 'center';
    }

    if (
      titleDisposition === 'top-center' &&
      textDispostion === 'bottom-center'
    ) {
      return 'space-between';
    }

    if (
      titleDisposition === 'bottom-right' &&
      textDispostion === 'bottom-right'
    ) {
      return 'end';
    }

    if (titleDisposition === 'top-left' && textDispostion === 'bottom-right') {
      return 'space-between';
    }

    return '';
  },
  getAlignItems(titleDisposition: string, textDispostion: string): string {
    if (titleDisposition === 'center' && textDispostion === 'center') {
      return 'center';
    }

    if (
      titleDisposition === 'top-center' &&
      textDispostion === 'bottom-center'
    ) {
      return 'center';
    }

    if (
      titleDisposition === 'bottom-right' &&
      textDispostion === 'bottom-right'
    ) {
      return 'flex-end';
    }

    if (titleDisposition === 'top-left' && textDispostion === 'bottom-right') {
      return 'baseline';
    }

    return '';
  },
  getAlignSelfText(titleDisposition: string, textDispostion: string): string {
    if (titleDisposition === 'top-left' && textDispostion === 'bottom-right') {
      return 'flex-end';
    }

    return 'auto';
  },
  getElementPositioning(disposition: string): React.CSSProperties {
    const padding = '30px';
    const positions: Record<string, React.CSSProperties> = {
      'top-left': { top: padding, left: padding },
      'top-center': {
        top: padding,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      'top-right': { top: padding, right: padding },
      'middle-left': {
        top: '50%',
        left: padding,
        transform: 'translateY(-50%)',
      },
      'middle-center': {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      'middle-right': {
        top: '50%',
        right: padding,
        transform: 'translateY(-50%)',
      },
      'bottom-left': { bottom: padding, left: padding },
      'bottom-center': {
        bottom: padding,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      'bottom-right': { bottom: padding, right: padding },
    };
    return positions[disposition] || positions['middle-center'];
  },
  getTextAlign(disposition: string): 'left' | 'center' | 'right' {
    if (disposition.includes('left')) return 'left';
    if (disposition.includes('right')) return 'right';
    return 'center';
  },
};
