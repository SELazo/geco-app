import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddcontact.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GContactsIcon, GIconButtonBack } from '../../../constants/buttons';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GBlack, GWhite, GYellow, GRed } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { SessionState } from '../../../redux/sessionSlice';

export const GEditContactPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Obtener usuario desde Redux
  const user = useSelector((state: SessionState) => state.user);
  const auth = useSelector((state: SessionState) => state.auth);
  
  // Estados para manejo de carga y errores
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const [contact, setContact] = useState<IContact | null>(null);
  const [userWarning, setUserWarning] = useState<string>('');

  // Esquema de validación
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
          if (!value) return true;
          
          const patterns = [
            /^\+[1-9]\d{1,14}$/,
            /^[0-9]{7,15}$/,
            /^\+[1-9]\d{0,3}[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}$/,
          ];
          
          return patterns.some(pattern => pattern.test(value.replace(/[\s-]/g, '')));
        }
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    email?: string;
    cellphone?: string;
  }>({
    resolver: yupResolver(validationSchema),
  });

  // Verificar usuario al cargar el componente
  useEffect(() => {
    console.log('🔍 Verificando usuario al cargar componente:', user);
    
    if (!user || !user.id || user.id === -1) {
      console.log('🔐 Estado de autenticación:', auth);
      setUserWarning('⚠️ No hay usuario activo. Es posible que necesites iniciar sesión o crear un usuario de prueba.');
    } else {
      setUserWarning('');
      console.log('✅ Usuario válido encontrado:', user);
    }
  }, [user, auth]);

  // Cargar contacto al montar el componente
  useEffect(() => {
    const loadContact = async () => {
      if (!id) {
        setSaveError('ID de contacto no proporcionado');
        setLoading(false);
        return;
      }

      if (!user || !user.id || user.id === -1) {
        setSaveError('Usuario no encontrado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📥 Cargando contacto con ID:', id);
        
        const contactData = await ContactsFirestoreService.getContact(id);
        
        if (!contactData) {
          setSaveError('Contacto no encontrado');
          return;
        }

        // Verificar que el contacto pertenece al usuario actual
        if (contactData.userId !== user.id.toString()) {
          setSaveError('No tienes permisos para editar este contacto');
          return;
        }

        setContact(contactData);
        
        // Llenar el formulario con los datos del contacto
        setValue('name', contactData.name);
        setValue('email', contactData.email || '');
        setValue('cellphone', contactData.phone || '');
        
        console.log('✅ Contacto cargado:', contactData);
        
      } catch (error) {
        console.error('❌ Error cargando contacto:', error);
        setSaveError(error instanceof Error ? error.message : 'Error cargando contacto');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id, user, setValue]);

  const onSubmit = async (data: { name: string; email?: string; cellphone?: string }) => {
    try {
      setSaving(true);
      setSaveError('');

      console.log('📝 Datos del formulario:', data);
      console.log('👤 Usuario actual:', user);

      // Validar que tenemos un usuario válido
      if (!user || !user.id || user.id === -1) {
        setSaveError('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Validar que tenemos un contacto cargado
      if (!contact) {
        setSaveError('No se pudo cargar el contacto para editar.');
        return;
      }

      // Validar que tenemos al menos email o teléfono
      if (!data.email && !data.cellphone) {
        setSaveError('Por favor ingrese al menos un email o número de celular.');
        return;
      }

      // Limpiar campos vacíos
      const cleanEmail = data.email?.trim() || undefined;
      const cleanPhone = data.cellphone?.trim() || undefined;

      // Crear objeto de contacto actualizado
      const updatedContactData: Partial<IContact> = {
        name: data.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
      };

      console.log('💾 Datos a actualizar:', updatedContactData);

      // Actualizar en Firestore
      await ContactsFirestoreService.updateContact(contact.id!, updatedContactData);
      
      console.log('✅ Contacto actualizado con ID:', contact.id);
      
      // Navegar de vuelta a la lista de contactos
      navigate('/contacts/list');
      
    } catch (error) {
      console.error('❌ Error actualizando contacto:', error);
      setSaveError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el contacto "${contact.name}"? Esta acción no se puede deshacer.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setSaving(true);
      console.log('🗑️ Eliminando contacto:', contact.id);
      
      await ContactsFirestoreService.deleteContact(contact.id!);
      
      console.log('✅ Contacto eliminado exitosamente');
      
      // Navegar de vuelta a la lista de contactos
      navigate('/contacts/list');
      
    } catch (error) {
      console.error('❌ Error eliminando contacto:', error);
      setSaveError(error instanceof Error ? error.message : 'Error eliminando contacto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="geco-add-contact-main">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <span style={{ marginLeft: '16px' }}>Cargando contacto...</span>
        </Box>
      </div>
    );
  }

  return (
    <div className="geco-add-contact-main">
      <div className="geco-add-contact-nav-bar">
        <Link className="geco-add-contact-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-add-contact-nav-bar-section" to="/contacts/options">
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
          title="Editar Contacto"
          subtitle={contact ? `Editando: ${contact.name}` : 'Cargando...'}
        />
      </div>
      
      {/* Mostrar advertencia de usuario si existe */}
      {userWarning && (
        <Box sx={{ mb: 2, mx: 2 }}>
          <Alert severity="warning">
            {userWarning}
          </Alert>
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
            Error: {saveError}
          </Alert>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          {/* Botón de actualizar */}
          <div style={{ position: 'relative', flex: 1 }}>
            <GSubmitButton
              label={saving ? "Actualizando..." : "Actualizar Contacto"}
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
          
          {/* Botón de eliminar */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            style={{
              padding: '12px 24px',
              backgroundColor: saving ? '#ccc' : GRed,
              color: GWhite,
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {saving ? 'Procesando...' : '🗑️ Eliminar'}
          </button>
        </div>
      </form>
    </div>
  );
};
