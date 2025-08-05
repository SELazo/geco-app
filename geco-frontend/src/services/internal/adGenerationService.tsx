import html2canvas from 'html2canvas';
import { INewAd } from '../../interfaces/dtos/external/IAds';
import Image from 'image-js';

export const AdGenerationService = {
  async generation(props: INewAd): Promise<string> {
    const imageStyle: React.CSSProperties = {
      backgroundImage: `url(${URL.createObjectURL(props.img as File)})`,
      width: props.template.width,
      height: props.template.height,
      padding: props.template.padding,
      display: 'flex',
      flexDirection: 'column',
      backgroundSize: 'cover',
      justifyContent: this.getJustifyContent(
        props.template.titleDisposition,
        props.template.textDispostion
      ),
      alignItems: this.getAlignItems(
        props.template.titleDisposition,
        props.template.textDispostion
      ),
    };

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';

    const adDiv = document.createElement('div');
    Object.assign(adDiv.style, imageStyle);
    hiddenContainer.appendChild(adDiv);

    if (props.titleAd) {
      const titleStyle: React.CSSProperties = {
        color: props.pallette,
        fontStyle: 'normal',
        fontWeight: 900,
        padding: '20px',
        margin: '20px 0',
        backgroundColor: 'rgba(240, 240, 240, 0.7)',
        fontSize: props.template.titleSize,
        maxWidth: props.template.titleWidth,
        textAlign: 'center',
        overflowWrap: 'break-word',
      };
      const titleH1 = document.createElement('h1');
      titleH1.textContent = props.titleAd;
      Object.assign(titleH1.style, titleStyle);
      adDiv.appendChild(titleH1);
    }

    if (props.textAd) {
      const textStyle: React.CSSProperties = {
        color: props.pallette,
        fontStyle: 'normal',
        fontWeight: 500,
        padding: '20px',
        margin: 0,
        backgroundColor: 'rgba(240, 240, 240, 0.7)',
        fontSize: props.template.textSize,
        maxWidth: props.template.textWidth,
        textAlign: 'center',
        justifyContent: 'center',
        overflowWrap: 'break-word',
        alignSelf: this.getAlignSelfText(
          props.template.titleDisposition,
          props.template.textDispostion
        ),
      };
      const textP = document.createElement('p');
      textP.textContent = props.textAd;
      Object.assign(textP.style, textStyle);
      adDiv.appendChild(textP);
    }

    document.body.appendChild(hiddenContainer);
    const canvas = await html2canvas(adDiv);
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
};
