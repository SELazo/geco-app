import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import {
  AdIdentificationHelp,
  CreateAdIdentificationTitle,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useDispatch, useSelector } from 'react-redux';
import { AdsFirestoreService } from '../../../services/external/adsFirestoreService';
import { IAd } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { clearNewAdForm } from '../../../redux/sessionSlice';
import { compressBase64Image, getBase64SizeKB } from '../../../utils/imageCompression';

type AdData = {
  titleHelper: string;
  descriptionHelper?: string;
};

export const GAdIdentificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const formNewAd = useSelector((state: RootState) => state.formNewAd);
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const validationSchema = Yup.object().shape({
    titleHelper: Yup.string()
      .required(
        'Por favor ingrese un titulo identificativo para su publicidad, esto te ayudara a encontrarla para utillizarla en tus estrategias de comunicación.'
      )
      .max(45, 'El texto no puede tener más de 50 caracteres'),
    descriptionHelper: Yup.string()
      .required(
        'Por favor ingrese el mensaje con el cual se enviará la publicidad'
      )
      .max(500, 'El texto no puede tener más de 500 caracteres'),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const base64Ad = location && location.state;

  useEffect(() => {
    console.log('🔍 Verificando datos al cargar componente...');
    console.log('👤 Usuario:', user);
    console.log('🔒 isAuthenticated:', isAuthenticated);
    console.log('📋 formNewAd:', formNewAd);
    console.log('🖼️ base64Ad disponible:', !!base64Ad);
    
    // Obtener usuario: de Redux o de localStorage
    let currentUser = user;
    
    if (!currentUser || !currentUser.id) {
      console.log('⏳ Usuario no disponible en Redux, cargando desde localStorage...');
      
      // Cargar directamente desde localStorage
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        console.error('❌ No hay usuario en localStorage - Redirigiendo a login...');
        setIsReady(false);
        navigate('/login');
        return;
      }
      
      // Parsear usuario desde localStorage
      try {
        currentUser = JSON.parse(storedUser);
        console.log('✅ Usuario cargado desde localStorage:', currentUser);
      } catch (e) {
        console.error('❌ Error parseando usuario - Redirigiendo a login...');
        setIsReady(false);
        navigate('/login');
        return;
      }
    }
    
    // Verificar que tenemos un usuario válido (con email como mínimo)
    if (!currentUser || (!currentUser.id && !currentUser.email)) {
      console.error('❌ Usuario inválido (sin id ni email) - Redirigiendo a login...');
      console.error('❌ Usuario recibido:', currentUser);
      setIsReady(false);
      navigate('/login');
      return;
    }
    
    // Usuario disponible, verificar formNewAd
    if (!formNewAd || !formNewAd.template || !formNewAd.pallette || !base64Ad) {
      console.error('❌ formNewAd no está completo:', formNewAd);
      navigate(`${ROUTES.AD.ROOT}`);
      return;
    }
    
    console.log('✅ Todos los datos disponibles para crear publicidad');
    setIsReady(true);
    setError(null);
  }, []); // Solo ejecutar una vez al montar

  const onSubmit = async (data: AdData) => {
    // Obtener usuario de Redux o localStorage
    let currentUser = user;
    
    if (!currentUser || !currentUser.id) {
      console.log('⏳ Usuario no disponible en Redux, cargando desde localStorage...');
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        setError('Usuario no disponible. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      try {
        currentUser = JSON.parse(storedUser);
        console.log('✅ Usuario cargado desde localStorage para crear:', currentUser);
      } catch (e) {
        setError('Error al cargar usuario. Por favor, inicia sesión nuevamente.');
        return;
      }
    }
    
    // Verificar que tenemos un usuario válido (id o email)
    if (!currentUser || (!currentUser.id && !currentUser.email)) {
      setError('Usuario inválido. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    // Usar id o email como identificador
    const userId = currentUser.id || currentUser.email;
    console.log('✅ Usando identificador de usuario:', userId);

    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Iniciando creación de publicidad...');
      console.log('👤 Usuario ID:', userId);
      
      if (!base64Ad) {
        throw new Error('No hay imagen base64 disponible');
      }
      
      console.log('🖼️ Imagen base64 (longitud):', base64Ad.length);
      
      // Comprimir imagen si es necesaria
      const originalSizeKB = getBase64SizeKB(base64Ad);
      console.log('📏 Tamaño original de imagen:', originalSizeKB, 'KB');
      
      let finalImage = base64Ad;
      if (originalSizeKB > 700) {
        console.log('🗜️ Imagen supera 700KB, comprimiendo...');
        finalImage = await compressBase64Image(base64Ad, 700, 0.8);
        const compressedSizeKB = getBase64SizeKB(finalImage);
        console.log('✅ Imagen comprimida:', compressedSizeKB, 'KB');
        console.log('✅ Reducción:', Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100), '%');
      } else {
        console.log('✅ Imagen dentro del límite, no requiere compresión');
      }
      
      const adInfo = { ...formNewAd };
      
      // Crear objeto de publicidad para Firestore usando interfaz IAd
      const adData: any = {
        title: data.titleHelper.trim(), // ✅ Sin prefijo para IAd
        description: data.descriptionHelper?.trim() || '', // ✅ Sin prefijo para IAd
        content: {
          titleAd: data.titleHelper.trim(),
          textAd: data.descriptionHelper?.trim() || '',
          imageUrl: finalImage
        },
        template: adInfo.template ? String(adInfo.template.id) : '',
        palette: adInfo.pallette || '',
        size: adInfo.size || '1080x1080',
        userId: String(userId),
        status: 'active' as const,
      };
      
      console.log('💾 Guardando en Firestore...');
      console.log('💾 Datos:', {
        title: adData.title,
        userId: adData.userId,
        imageLength: adData.content?.imageUrl?.length || 0
      });
      
      // Guardar en Firestore (IGUAL QUE CONTACTOS)
      const adId = await AdsFirestoreService.createAd(adData);
      
      console.log('✅ Publicidad creada con ID:', adId);
      
      // Limpiar formulario y navegar (IGUAL QUE CONTACTOS)
      reset();
      dispatch(clearNewAdForm());
      
      console.log('🚀 Navegando a pantalla de éxito...');
      navigate('/ad/create/success');
      
      console.log('✅ Proceso completado');
    } catch (error: any) {
      console.error('❌ Error al crear publicidad:', error);
      console.error('❌ Detalles:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      setError(`Error al crear la publicidad: ${error?.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    titleHelper: string;
    descriptionHelper: string;
  }>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-add-contact-excel-nav-bar-section" to="/ad">
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
        <div className="geco-create-ad-nav-bar-right">
          <GDropdownHelp
            title={AdIdentificationHelp.title}
            body={AdIdentificationHelp.body}
            body2={AdIdentificationHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateAdIdentificationTitle.title}
          subtitle={CreateAdIdentificationTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        {(loading || !isReady) ? (
          <div
            style={{
              textAlign: 'start',
              marginTop: '25vh',
            }}
          >
            <PacmanLoader color={GYellow} />
            {!isReady && !loading && (
              <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Cargando datos del usuario...
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="input-group">
              <input
                type="text"
                {...register('titleHelper')}
                placeholder="Nombre de la publicidad"
                className={`input-box form-control ${
                  errors.titleHelper ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">{errors.titleHelper?.message}</span>
            </div>
            <div className="input-group">
              <textarea
                {...register('descriptionHelper')}
                placeholder="Escribe el mensaje que se adjuntará a la imagen de tu publicidad al difundirla."
                className={`input-box form-control ${
                  errors.descriptionHelper ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">
                {errors.descriptionHelper?.message}
              </span>
            </div>

            {error && (
              <div className="span-error" style={{ marginBottom: '15px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <GSubmitButton
              label="Crear publicidad"
              colorBackground={GYellow}
              colorFont={GBlack}
            />
          </>
        )}
      </form>
    </div>
  );
};
