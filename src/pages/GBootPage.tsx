import { Link } from 'react-router-dom';

import '../styles/gboot.css';
import { GLogoLetter } from '../components/GLogoLetter';
import { BlueYelowPalette } from '../constants/palette';

import geco from '../assets/images/geco_animal_crop.svg';
import desertores from '../assets/images/logo_desertores.svg';

export const GBootPage = () => {
  return (
    <div className='boot-main'>

      <div className='buttom-login'>
          <div className='img-login'>
            <Link to="/login">
              <GLogoLetter />
            </Link>
          </div>
        </div>
        <div className='dev-by'>
          <div className='div-dev-by'>
            <p className="geco-develop ">desarrollado por</p>
            <img src={desertores} alt="SVG" />
          </div>
        </div>

    </div>
  );
};
