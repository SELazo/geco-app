import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddcontactsexcel.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack } from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { AddContactsExcelSectionTitle } from '../../../constants/wording';
import { GBlack, GGreen, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/navigationService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useState } from 'react';
import { GIcon } from '../../../components/GIcon';

const EXAMPLE_URL =
  'https://docs.google.com/spreadsheets/d/1vqt6EbxHXypIU73HsWhpmGDQkzeN4zLh/edit?usp=share_link&ouid=104991212361139592910&rtpof=true&sd=true';

const MAX_FILENAME_LENGTH = 25;

type ContactFromExcelForm = {
  file: File;
};
export const GAddContactsExcelPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    //llamada al servicio
    //si okey
    if (!selectedFile) {
      setFileError('Por favor, seleccione un archivo Excel.');
      return;
    }

    navigate('/contacts/success-add-contact');
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setSelectedFile(file);
  };

  return (
    <div className="geco-add-contacts-excel-main">
      <div className="geco-add-contacts-excel-nav-bar">
        <Link className="geco-add-contacts-excel-nav-bar-logo" to="/home">
          <GLogoLetter />
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
      <div className="geco-add-contacts-excel-header-title">
        <GHeadSectionTitle
          title={AddContactsExcelSectionTitle.title}
          subtitle={AddContactsExcelSectionTitle.subtitle}
        />
        <a href={EXAMPLE_URL} target="_blank" download>
          Descarga una muestra!
        </a>
      </div>
      <form className="geco-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="file-upload" className="custom-file-upload">
            Importar excel
            <GIcon icon-type="chevron-right" color={GWhite} />
          </label>
          <input
            id="file-upload"
            required
            type="file"
            accept=".xls,.xlsx"
            onDragOver={(e) => e.preventDefault}
            onDrop={(e) => e.preventDefault}
            multiple={false}
            onChange={handleFileChange}
            className="input-box-excel form-control"
          />
        </div>
        {selectedFile && (
          <div className="file-preview">
            <GIcon icon-type="file-excel" color={GGreen} />
            <span className="file-preview-name">
              {fileName.length > MAX_FILENAME_LENGTH
                ? `${fileName.substring(0, MAX_FILENAME_LENGTH)}...${fileName
                    .split('.')
                    .pop()}`
                : fileName}
            </span>
          </div>
        )}

        <GSubmitButton
          label="Importar contactos"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
