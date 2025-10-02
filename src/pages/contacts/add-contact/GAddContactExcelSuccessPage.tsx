import { useLocation } from 'react-router-dom';
import { Alert, Box } from '@mui/material';

import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { ContactsExcelAdded } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAddContactsExcelSuccessPage = () => {
  const location = useLocation();
  const importStats = location.state as { 
    imported: number; 
    failed: number; 
    total: number; 
    skippedDuplicates?: number; 
    originalTotal?: number; 
  } | null;

  const getTitle = () => {
    if (importStats) {
      if (importStats.failed === 0) {
        return `¡${importStats.imported} contacto${importStats.imported !== 1 ? 's' : ''} importado${importStats.imported !== 1 ? 's' : ''} exitosamente!`;
      } else {
        return `Importación completada con advertencias`;
      }
    }
    return ContactsExcelAdded.title;
  };

  const getSubtitle = () => {
    if (importStats) {
      let subtitle = '';
      
      if (importStats.failed === 0 && (!importStats.skippedDuplicates || importStats.skippedDuplicates === 0)) {
        subtitle = `Todos los contactos del archivo Excel fueron guardados correctamente en tu agenda.`;
      } else {
        subtitle = `Se importaron ${importStats.imported} contacto${importStats.imported !== 1 ? 's' : ''} correctamente.`;
        
        if (importStats.skippedDuplicates && importStats.skippedDuplicates > 0) {
          subtitle += ` Se omitieron ${importStats.skippedDuplicates} contacto${importStats.skippedDuplicates !== 1 ? 's' : ''} duplicado${importStats.skippedDuplicates !== 1 ? 's' : ''}.`;
        }
        
        if (importStats.failed > 0) {
          subtitle += ` ${importStats.failed} contacto${importStats.failed !== 1 ? 's' : ''} no pudo${importStats.failed !== 1 ? 'ieron' : ''} ser importado${importStats.failed !== 1 ? 's' : ''}.`;
        }
      }
      
      return subtitle;
    }
    return ContactsExcelAdded.subtitle;
  };

  return (
    <div className="success-send-message-main">
      {importStats && importStats.failed > 0 && (
        <Box sx={{ mb: 3, mx: 2 }}>
          <Alert severity="warning">
            <strong>Advertencia:</strong> {importStats.failed} contacto{importStats.failed !== 1 ? 's' : ''} no pudo{importStats.failed !== 1 ? 'ieron' : ''} ser importado{importStats.failed !== 1 ? 's' : ''}. 
            Esto puede deberse a datos faltantes o formato incorrecto.
          </Alert>
        </Box>
      )}
      
      {importStats && importStats.skippedDuplicates && importStats.skippedDuplicates > 0 && (
        <Box sx={{ mb: 3, mx: 2 }}>
          <Alert severity="info">
            <strong>Duplicados omitidos:</strong> Se omitieron {importStats.skippedDuplicates} contacto{importStats.skippedDuplicates !== 1 ? 's' : ''} duplicado{importStats.skippedDuplicates !== 1 ? 's' : ''} 
            para evitar contactos repetidos en tu agenda.
          </Alert>
        </Box>
      )}
      
      <GFeedback
        title={getTitle()}
        subtitle={getSubtitle()}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={ContactsExcelAdded.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={ContactsExcelAdded.buttonPath}
      />
    </div>
  );
};
