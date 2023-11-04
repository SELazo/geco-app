import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gadimage.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GDeletetIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  AdOwnImgHelp,
  CreateAdGeneratedTitle,
  CreateAdOwnImgTitle,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useState } from 'react';
import { GIcon } from '../../../components/GIcon';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { GErrorPopup } from '../../../components/GErrorPopup';
import { ROUTES } from '../../../constants/routes';

type OwnImgForm = {
  file: File;
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const GAdOwnImgPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [requestError, setRequestError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      setFileError('El archivo no tenia el formato correcto. 😔');
      setRequestError(true);
      return;
    }

    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.AD_GENERATION}`,
      { state: selectedFile }
    );
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (verifyFile(file)) {
      setSelectedFile(file);
    }
  };

  const verifyFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('El archivo no tenia el formato correcto. 😔');
      setRequestError(true);
      return false;
    }

    return true;
  };

  return (
    <div className="geco-ad-main">
      <div className="geco-ad-head-nav-bar">
        <div className="geco-ad-nav-bar">
          <Link className="geco-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-ad-nav-bar-section" to="/ad">
            <GCircularButton
              icon={GAdIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
            />
          </Link>
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.goBack}
          />
        </div>
        <div className="geco-ad-nav-bar-right">
          <GDropdownHelp title={AdOwnImgHelp.title} body={AdOwnImgHelp.body} />
        </div>
      </div>

      <>
        <div className="geco-ad-header-title">
          <GHeadSectionTitle
            title={CreateAdOwnImgTitle.title}
            subtitle={CreateAdOwnImgTitle.subtitle}
          />
        </div>
        <form className="geco-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="file-upload" className="custom-file-upload">
              Adjuntar archivo
              <GIcon icon-type="chevron-right" color={GWhite} />
            </label>
            <input
              id="file-upload"
              name="file"
              type="file"
              accept=".jpg,.jpeg,.png"
              onDragOver={(e) => e.preventDefault}
              onDrop={(e) => e.preventDefault}
              multiple={false}
              onChange={handleFileChange}
              className="input-box-excel form-control"
            />
          </div>
          {selectedFile && (
            <div className="file-preview">
              <img src={URL.createObjectURL(selectedFile)} alt="Vista previa" />
            </div>
          )}

          <GSubmitButton
            label="Importar"
            colorBackground={GYellow}
            colorFont={GBlack}
          />
        </form>
      </>

      {requestError && (
        <GErrorPopup
          icon={GDeletetIcon}
          label={fileError}
          onRequestError={() => setRequestError(false)}
        />
      )}
    </div>
  );
};
