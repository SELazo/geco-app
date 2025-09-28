import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress } from '@mui/material';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddcontact.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GContactsIcon, GIconButtonBack } from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { AddContactSectionTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { IContactData } from '../../../interfaces/IContact';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { SessionState } from '../../../redux/sessionSlice';
import { ROUTES } from '../../../constants/routes';

export const GAddContactPage = () => {
  const navigate = useNavigate();
  
  // Obtener usuario desde Redux
  const user = useSelector((state: SessionState) => state.user);
  
  // Estados para manejo de carga y errores
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Por favor ingrese un nombre completo.'),
    email: Yup.string()
      .required('Por favor ingrese un correo electrónico.')
      .email('Por favor ingrese un correo electrónico válido'),
    cellphone: Yup.string()
      .required('Por favor ingrese un correo electrónico.')
      .test(
        'has-contact-info',
        'Por favor ingrese al menos un número de celular.',
        function (value) {
          const { email, cellphone } = this.parent;
          if (!email && !cellphone) {
            return false;
          }
          return true;
        }
      )
      .matches(
        /^\+[0-9]{1,3}\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{4}$/,
        'Por favor ingrese un número de celular válido.'
      ),
  });

  const onSubmit = async ({ name, email, cellphone }: IContactData) => {
    try {
      setSaving(true);
      setSaveError('');

      // Crear objeto de contacto para Firestore
      const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        email,
        phone: cellphone,
        groups: [], // Sin grupos inicialmente
        tags: [],
        userId: user.id.toString(),
        status: 'active',
      };

      // Guardar en Firestore
      const contactId = await ContactsFirestoreService.createContact(contactData);
      
      console.log('✅ Contacto guardado con ID:', contactId);
      
      // Limpiar formulario y navegar
      reset();
      navigate(ROUTES.CONTACTS.ADD_CONTACT);
      
    } catch (error) {
      console.error('❌ Error guardando contacto:', error);
      setSaveError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    cellphone: string;
  }>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-add-contact-main">
      <div className="geco-add-contact-nav-bar">
        <Link className="geco-add-contact-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-add-contact-nav-bar-section" to="/contacts/info">
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
      <div className="geco-add-contact-header-title">
        <GHeadSectionTitle
          title={AddContactSectionTitle.title}
          subtitle={AddContactSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('name')}
            placeholder="Nombre del contacto"
            className={`input-box form-control ${
              errors.name ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.name?.message}</span>
        </div>
        <div className="input-group">
          <input
            type="email"
            {...register('email')}
            placeholder="Email del contacto"
            className={`input-box form-control ${
              errors.email ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.email?.message}</span>
        </div>
        <div className="input-group">
          <input
            type="text"
            {...register('cellphone')}
            placeholder="Celular del contacto"
            className={`input-box form-control ${
              errors.cellphone ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.cellphone?.message}</span>
        </div>

        {/* Mostrar error si existe */}
        {saveError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al guardar contacto: {saveError}
          </Alert>
        )}

        {/* Botón de submit con indicador de carga */}
        <div style={{ position: 'relative', marginTop: '16px' }}>
          <GSubmitButton
            label={saving ? "Guardando..." : "Enviar"}
            colorBackground={saving ? '#ccc' : GYellow}
            colorFont={GBlack}
            disabled={saving}
          />
          {saving && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </div>
      </form>
    </div>
  );
};
