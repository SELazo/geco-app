import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/navigationService/navigationService';
import * as XLSX from 'xlsx';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddcontactsexcel.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GContactsIcon,
  GDeletetIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  AddContactsExcelSectionTitle,
  ImportExcelHelp,
} from '../../../constants/wording';
import { GBlack, GGreen, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useState } from 'react';
import { GIcon } from '../../../components/GIcon';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { IContactData } from '../../../interfaces/IContact';
import { GErrorPopup } from '../../../components/GErrorPopup';

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
  const [requestError, setRequestError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    //llamada al servicio
    //si okey
    if (!selectedFile) {
      setFileError('Por favor, seleccione un archivo Excel. 😔');
      setRequestError(true);
      return;
    }

    let contacts: IContactData[] = [];

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        if (e.target === null) {
          setFileError('No encontramos el archivo. 😔');
          setRequestError(true);
          return;
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const requiredColumns = ['Nombre', 'Email', 'Celular'];

        const headerRow = parsedData[0];
        const missingColumns = requiredColumns.filter(
          (column) => !Array.isArray(headerRow) || !headerRow.includes(column)
        );

        if (missingColumns.length > 0) {
          setFileError('El archivo no tenía el formato correcto. 😔');
          setRequestError(true);
          return;
        } else {
          const contactRows = parsedData.slice(1);

          const newContacts = contactRows.map((row) => {
            const [nombre, email, celular] = row as string[];
            if (!nombre || !celular) {
              return null;
            }
            return {
              name: nombre,
              email,
              cellphone: celular,
            };
          });

          contacts = newContacts.filter(
            (contact) => contact !== null
          ) as IContactData[];

          if (contacts.length === 0) {
            setFileError('El archivo no tenía contactos. 😔');
            setRequestError(true);
            return;
          }

          console.log('vamos bien');
          navigate('/contacts/list-contacts-to-import', {
            state: { contacts: contacts },
          });
        }
      };
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleRequestError = () => {
    setRequestError(true);
  };

  return (
    <div className="geco-add-contacts-excel-main">
      <div className="geco-add-contacts-excel-head-nav-bar">
        <div className="geco-add-contacts-excel-nav-bar">
          <Link className="geco-add-contacts-excel-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link
            className="geco-add-contact-excel-nav-bar-section"
            to="/contacts/info"
          >
            <GCircularButton
              icon={GContactsIcon}
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
        <div className="geco-add-contacts-excel-nav-bar-right">
          <GDropdownHelp
            title={ImportExcelHelp.title}
            body={ImportExcelHelp.body}
            routeLabel={ImportExcelHelp.routeLabel}
            route={ImportExcelHelp.route}
          />
        </div>
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
