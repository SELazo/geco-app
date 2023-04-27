import { Link } from 'react-router-dom';

import '../styles/gboot.css';
import { GLogoLetter } from '../components/GLogoLetter';
import { BlueYelowPalette } from '../constants/palette';

import geco from '../assets/images/geco_animal_crop.svg';
import desertores from '../assets/images/logo_desertores.svg';

export const GBootPage = () => {
  return (
    <div
      style={{
        background: BlueYelowPalette.backgroundColor,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        placeContent: 'flex-end',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
      <Link to="/login">
        <GLogoLetter />
      </Link>
      <img
        src={geco}
        alt="SVG"
        style={{
          width: '100%',
          fill: BlueYelowPalette.gecoColor,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <p className="geco-develop ">desarrollado por</p>
        <img src={desertores} alt="SVG" />
      </div>
    </div>
  );
};
