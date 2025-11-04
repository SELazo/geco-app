import('../../../styles/gads.css');

import { useEffect, useState } from 'react';

import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GDeletetIcon,
  GIconButtonBack,
  GViewIcon,
} from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { AdsServiceHybrid } from '../../../services/external/adsServiceHybrid';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { AdHeadCenterTitle } from '../../../constants/wording';
import { GAdListItem } from '../../../components/GAdListItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link, useNavigate } from 'react-router-dom';
import { IAd } from '../../../interfaces/dtos/external/IFirestore';
import { ROUTES } from '../../../constants/routes';
import { GPopUpMessage } from '../../../components/GPopUpMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/gecoStore';

export const GAdsListPage = () => {
  const [ads, setAds] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isDeleteErrorPopupOpen, setDeleteErrorPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('🔄 useEffect ejecutado - Usuario:', user);
    console.log('🔄 useEffect ejecutado - isAuthenticated:', isAuthenticated);
    
    const fetchAds = async () => {
      // Obtener usuario: de Redux o de localStorage
      let currentUser = user;
      
      if (!currentUser || !currentUser.id) {
        console.log('⏳ Usuario no disponible en Redux, cargando desde localStorage...');
        
        // Cargar directamente desde localStorage
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
          console.error('❌ No hay usuario en localStorage - Redirigiendo a login...');
          setLoading(false);
          navigate('/login');
          return;
        }
        
        // Parsear usuario desde localStorage
        try {
          currentUser = JSON.parse(storedUser);
          console.log('✅ Usuario cargado desde localStorage:', currentUser);
        } catch (e) {
          console.error('❌ Error parseando usuario - Redirigiendo a login...');
          setLoading(false);
          navigate('/login');
          return;
        }
      }
      
      // Verificar que tenemos un usuario válido (con email como mínimo)
      if (!currentUser || (!currentUser.id && !currentUser.email)) {
        console.error('❌ Usuario inválido (sin id ni email) - Redirigiendo a login...');
        console.error('❌ Usuario recibido:', currentUser);
        setLoading(false);
        navigate('/login');
        return;
      }
      
      // Si no tiene id pero tiene email, usar email como identificador
      const userId = currentUser.id || currentUser.email;
      console.log('✅ Usando identificador de usuario:', userId);
      
      try {
        console.log('✅ Usuario disponible:', userId);
        console.log('🔍 Cargando publicidades para usuario:', userId);
        const adsData = await AdsServiceHybrid.getUserAds(String(userId));
        console.log('📦 Publicidades obtenidas de Firestore:', adsData);
        
        if (!adsData || adsData.length === 0) {
          console.log('ℹ️ No hay publicidades para este usuario');
          setAds([]);
          setLoading(false);
          return;
        }
        
        // Mapear datos de Firestore a la interfaz esperada
        const mappedAds = adsData.map((ad: any) => {
          console.log('🗺️ Mapeando publicidad:', ad);
          
          // Manejar ad_create_date que puede ser Timestamp o Date
          let dateString = new Date().toISOString();
          if (ad.ad_create_date) {
            if (typeof ad.ad_create_date === 'object' && 'seconds' in ad.ad_create_date) {
              // Es un Timestamp de Firestore
              dateString = new Date((ad.ad_create_date as any).seconds * 1000).toISOString();
            } else if (ad.ad_create_date instanceof Date) {
              dateString = ad.ad_create_date.toISOString();
            }
          }
          
          // 🔍 BUSCAR IMAGEN EN MÚLTIPLES UBICACIONES (soporta estructuras antiguas y nuevas)
          let imageUrl = '';
          if (ad.ad_image) {
            // Estructura actual: ad_image
            imageUrl = ad.ad_image;
            console.log('✅ Imagen encontrada en ad.ad_image (longitud):', imageUrl.length);
          } else if (ad.content?.imageUrl) {
            // Estructura alternativa: content.imageUrl
            imageUrl = ad.content.imageUrl;
            console.log('✅ Imagen encontrada en ad.content.imageUrl (longitud):', imageUrl.length);
          } else if (ad.imageUrl) {
            // Estructura alternativa: imageUrl directo
            imageUrl = ad.imageUrl;
            console.log('✅ Imagen encontrada en ad.imageUrl (longitud):', imageUrl.length);
          } else {
            console.warn('⚠️ No se encontró imagen para publicidad:', ad.id);
          }
          
          return {
            id: ad.id, // Mantener ID de Firestore (string)
            firestoreId: ad.id, // Guardar ID original
            firestoreData: ad, // Guardar datos completos de Firestore
            title: ad.ad_title || ad.title || 'Sin título',
            description: ad.ad_description || ad.description || '',
            size: ad.ad_size || ad.size || '1080x1080',
            create_date: dateString,
            deleted_date: ad.ad_deleted_date || null,
            account_id: ad.ad_account_id || 0,
            ad_template: {
              id: ad.ad_templates?.ad_temp_id || 0,
              type: ad.ad_size || '',
              disposition_pattern: ad.ad_templates?.ad_temp_id || 0,
              color_text: '#000000',
            },
            imageUrl: imageUrl, // ✅ Imagen con fallbacks múltiples
          };
        }) as any;
        
        console.log('✅ Publicidades mapeadas:', mappedAds);
        setAds(mappedAds);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar publicidades:', error);
        setLoading(false);
      }
    };

    fetchAds();
  }, []); // Solo ejecutar una vez al montar, ya que cargamos desde localStorage si es necesario

  const viewAd = (id: string) => {
    const adData = ads.find((ad) => ad.id === id);
    navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.LIST.VIEW}`, {
      state: adData,
    });
  };

  const handleDeleteAd = async () => {
    if (selectedId !== null) {
      try {
        await AdsServiceHybrid.deleteAd(selectedId);
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar publicidad:', error);
        setDeletePopupOpen(false);
        setDeleteErrorPopupOpen(true);
      }
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setDeletePopupOpen(true);
  };

  return (
    <>
      <div className="geco-ads-list">
        <div className="geco-ads-list-head">
          <div className="geco-ads-list-head-nav-bar">
            <Link className="geco-ads-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link className="geco-ads-list-nav-bar-section" to="/ad">
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
              onClickAction={NavigationService.handleNavigation(ROUTES.AD.ROOT)}
            />
          </div>
        </div>
        <div className="geco-ads-list-title">
          <GHeadCenterTitle title={AdHeadCenterTitle} color={GBlack} />
        </div>
        {loading && (
          <div className="geco-ads-empty">
            <p>Cargando publicidades...</p>
          </div>
        )}
        {!loading && ads.length > 0 && (
          <div className="geco-ads-list-container">
            <div className="geco-ads-list-ul">
              <div className="geco-ads-list-item">
                {ads.map((item) => (
                  item.id && (
                    <GAdListItem
                      key={item.id}
                      ad={item as any}
                      icon={GViewIcon}
                      iconBackgroundColor={GYellow}
                      onClickAction={() => viewAd(item.id!)}
                      icon2={GDeletetIcon}
                      iconBackgroundColor2={GRed}
                      onClickAction2={() => handleDelete(item.id!)}
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="geco-ads-empty">
            <p>No tiene publicidades aún.</p>
          </div>
        )}
      </div>

      {isDeletePopupOpen && (
        <GPopUpMessage
          isOpen={isDeletePopupOpen}
          title="¿Estás seguro de borrar esta publicidad?"
          body="Una publicidad borrada no será posible de recuperar."
          btn1="Confirmar"
          btn1Action={() => {
            handleDeleteAd();
            setDeletePopupOpen(false);
          }}
          btn2="Cancelar"
          btn2Action={() => {
            setDeletePopupOpen(false);
          }}
        />
      )}

      {isDeleteErrorPopupOpen && (
        <GPopUpMessage
          isOpen={isDeleteErrorPopupOpen}
          title="Hubo un error"
          body="Una publicidad es parte de una estrategia por lo que no puede ser borrada."
          btn1="Confirmar"
          btn1Action={() => {
            setDeleteErrorPopupOpen(false);
          }}
        />
      )}
    </>
  );
};
