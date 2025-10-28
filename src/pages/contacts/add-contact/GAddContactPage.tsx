import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';

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
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';
import { GLogoLetter } from '../../../components/GLogoLetter';

export const GAddContactPage = () => {
  const navigate = useNavigate();

  // Obtener usuario desde Redux
  const user = useSelector((state: RootState) => state.user);
  const auth = useSelector((state: RootState) => state.auth);

  // Estados para manejo de carga y errores
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const [userWarning, setUserWarning] = useState<string>('');

  // Verificar usuario al cargar el componente
  useEffect(() => {
    console.log('🔍 Verificando usuario al cargar componente:', user);

    if (!user || !user.id || user.id === -1) {
      console.log('🔐 Estado de autenticación:', auth);
      setUserWarning(
        '⚠️ No hay usuario activo. Es posible que necesites iniciar sesión o crear un usuario de prueba.'
      );

      // Verificar localStorage como backup
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('📦 Usuario encontrado en localStorage:', parsedUser);
          setUserWarning('');
        } catch (error) {
          console.error('❌ Error parseando usuario de localStorage:', error);
        }
      }
    } else {
      setUserWarning('');
      console.log('✅ Usuario válido encontrado:', user);
    }
  }, [user]);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Por favor ingrese un nombre completo.'),
    email: Yup.string()
      .email('Por favor ingrese un correo electrónico válido')
      .test(
        'has-contact-info',
        'Por favor ingrese al menos un email o número de celular.',
        function (value) {
          const { email, cellphone } = this.parent;
          if (!email && !cellphone) {
            return false;
          }
          return true;
        }
      ),
    cellphone: Yup.string()
      .test(
        'has-contact-info',
        'Por favor ingrese al menos un email o número de celular.',
        function (value) {
          const { email, cellphone } = this.parent;
          if (!email && !cellphone) {
            return false;
          }
          return true;
        }
      )
      .test(
        'valid-phone',
        'Por favor ingrese un número de celular válido (ej: +54911234567, 911234567, 1234567890).',
        function (value) {
          if (!value) return true; // Si está vacío, no validar formato (ya se valida en has-contact-info)

          // Patrones más flexibles para números de teléfono
          const patterns = [
            /^\+[1-9]\d{1,14}$/, // Formato internacional: +54911234567
            /^[0-9]{7,15}$/, // Solo números: 1234567890
            /^\+[1-9]\d{0,3}[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}$/, // Con espacios o guiones
          ];

          return patterns.some((pattern) =>
            pattern.test(value.replace(/[\s-]/g, ''))
          );
        }
      ),
  });

  const onSubmit = async (data: {
    name: string;
    email?: string;
    cellphone?: string;
  }) => {
    try {
      setSaving(true);
      setSaveError('');

      // Validar que tenemos un usuario válido (aceptar tanto string como number)
      if (!user || !user.id || user.id === -1 || user.id === '0' || user.id === 0) {
        console.error('❌ Usuario inválido:', user);
        setSaveError(
          'Usuario no encontrado. Por favor, inicia sesión nuevamente.'
        );
        return;
      }
      
      console.log('✅ Usuario válido para crear contacto:', user);

      // Validar que tenemos al menos email o teléfono
      if (!data.email && !data.cellphone) {
        setSaveError(
          'Por favor ingrese al menos un email o número de celular.'
        );
        return;
      }

      // Limpiar campos vacíos
      const cleanEmail = data.email?.trim() || undefined;
      const cleanPhone = data.cellphone?.trim() || undefined;

      // Crear objeto de contacto para Firestore
      const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        groups: [], // Sin grupos inicialmente
        tags: [],
        userId: user.id.toString(),
        status: 'active',
      };

      // Guardar en Firestore
      const contactId = await ContactsFirestoreService.createContact(
        contactData
      );

      // Limpiar formulario y navegar a la página de éxito
      reset();
      navigate('/contacts/success-add-contact');
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Error desconocido'
      );
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
    email?: string;
    cellphone?: string;
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

      {/* Mostrar advertencia de usuario si existe */}
      {userWarning && (
        <Box sx={{ mb: 2, mx: 2 }}>
          <Alert severity="warning">{userWarning}</Alert>
        </Box>
      )}

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
            placeholder="Email del contacto (opcional si tienes celular)"
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
            placeholder="Celular (ej: +54911234567, 911234567 o 1234567890)"
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
            label={saving ? 'Guardando...' : 'Enviar'}
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
