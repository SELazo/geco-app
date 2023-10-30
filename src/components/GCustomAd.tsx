import React, { useState } from 'react';

import '../styles/gcircularButton.css';
import { INewAd } from '../interfaces/dtos/external/IAds';

export const GCustomAd: React.FC<INewAd> = (props: INewAd) => {
  const imageStyle: React.CSSProperties = {
    backgroundImage: `url(${URL.createObjectURL(props.img as File)})`,
    width: props.template.width,
    height: props.template.height,
    padding: props.template.padding,
    display: 'flex',
    flexDirection: 'column',
    backgroundSize: 'cover',
    verticalAlign: isCenterDisposition() ? 'center' : '',
  };

  const titleStyle: React.CSSProperties = {
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: props.template.titleSize,
    width: props.template.titleWidth,
    textAlign: 'center',
    top: getTopPosition(props.template.titleDisposition),
    left: getLeftPosition(props.template.titleDisposition),
  };

  const textStyle: React.CSSProperties = {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: props.template.textSize,
    width: props.template.textWidth,
    textAlign: 'center',
    top: getTopPosition(props.template.textDispostion),
    left: getLeftPosition(props.template.textDispostion),
  };

  console.log(props.img);

  function getTopPosition(disposition: string): string {
    switch (disposition) {
      case 'top-left':
        return '0';
      case 'bottom-center':
        return '50%';
      case 'center':
        return '50%';
      default:
        return '0';
    }
  }

  function getLeftPosition(disposition: string): string {
    switch (disposition) {
      case 'bottom-right':
        return '0';
      case 'bottom-center':
        return '50%';
      case 'center':
        return '50%';
      default:
        return '0';
    }
  }

  function isCenterDisposition() {
    return (
      props.template.titleDisposition === 'center' &&
      props.template.textDispostion === 'center'
    );
  }
  return (
    <div style={imageStyle}>
      <h1 style={titleStyle}>{props.titleAd}</h1>
      <p style={textStyle}>{props.textAd}</p>
    </div>
  );
};
