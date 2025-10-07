import { FC } from 'react';
import { Alert, Chip, Box } from '@mui/material';

import('../styles/gcontactItem.css');

import { GIcon } from './GIcon';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { IContactResponse } from '../interfaces/dtos/external/IContacts';
import { IContact } from '../interfaces/dtos/external/IFirestore';
import { GYellow, GRed, GGreen, GWhite } from '../constants/palette';

interface IContactImportItemProps {
  contact: IContactResponse;
  icon: IButtonIcon;
  iconBackgroundColor: string;
  onClickAction: () => void;
  isDuplicate?: boolean;
  existingContact?: IContact;
  isCheckingDuplicates?: boolean;
}

export const GContactImportItem: FC<IContactImportItemProps> = (props) => {
  const getDuplicateIndicator = () => {
    if (props.isCheckingDuplicates) {
      return (
        <Chip
          label="Verificando..."
          size="small"
          color="default"
          sx={{ 
            fontSize: '0.7rem', 
            height: '20px',
            backgroundColor: '#f5f5f5',
            color: '#666'
          }}
        />
      );
    }
    if (props.isDuplicate && props.existingContact) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {props.isCheckingDuplicates ? (
            <Chip
              label="⚠️ POSIBLE DUPLICADO"
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          ) : (
            <Chip
              label="⚠️ POSIBLE DUPLICADO"
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          )}
          <div style={{ fontSize: '0.65rem', color: '#666', fontStyle: 'italic' }}>
            Similar a: {props.existingContact.name} (se importará de todos modos)
          </div>
        </Box>
      );
    }
    return (
      <Chip
        label="✅ NUEVO"
        size="small"
        sx={{ 
          fontSize: '0.7rem', 
          height: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        }}
      />
    );
  };

  return (
    <>
      <div className="geco-contact-item-card" style={{ position: 'relative' }}>
        {/* Indicador de duplicado en la esquina superior derecha */}
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          right: '60px', 
          zIndex: 1 
        }}>
          {getDuplicateIndicator()}
        </div>

        <div className="geco-contact-body">
          <h1 className="geco-contact-item-name">{props.contact.name}</h1>
          <div className="geco-contact-item-info">
            <p>{props.contact.phone}</p>
            {props.contact.email && <p>{props.contact.email}</p>}
          </div>
          
          {/* Información adicional para duplicados */}
          {props.isDuplicate && props.existingContact && (
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              backgroundColor: '#fff3cd', 
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#856404'
            }}>
              <strong>Coincidencia encontrada:</strong>
              <br />
              {props.existingContact.email && props.contact.email && 
               props.existingContact.email.toLowerCase() === props.contact.email.toLowerCase() && 
               "📧 Mismo email"}
              {props.existingContact.phone && props.contact.phone && 
               props.existingContact.phone.replace(/\D/g, '') === props.contact.phone.toString().replace(/\D/g, '') && 
               "📱 Mismo teléfono"}
            </div>
          )}
        </div>
        
        <button
          className="geco-edit-btn"
          style={{ backgroundColor: props.iconBackgroundColor }}
          onClick={props.onClickAction}
          title={props.isDuplicate ? "Eliminar de la lista (opcional - se puede importar duplicado)" : "Eliminar contacto de la lista"}
        >
          <GIcon
            color={props.icon['color']}
            icon-type={props.icon['icon-type']}
          />
        </button>
      </div>
    </>
  );
};
