import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewStrategyForm,
  setNewStrategyAds,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GIconButtonBack,
  GStrategyIcon,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  AddNewGroupStep2SectionTitle,
  CreateStrategyAdsTitle,
  NewStrategyAdsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { AdsService } from '../../../services/external/adsService';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsFirestoreService } from '../../../services/external/adsFirestoreService';
import { IAd } from '../../../interfaces/dtos/external/IFirestore';
import { DateService } from '../../../services/internal/dateService';

const { getAds } = AdsService;
const { getDateString } = DateService;

export const GStrategyAdsPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedFirestoreIds, setSelectedFirestoreIds] = useState<string[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const strategyForm: INewStrategyForm = useSelector(
    (state: any) => state.auth.formNewStrategy
  );

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log('🔍 Cargando publicidades desde Firestore...');
        
        // Obtener usuario
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('❌ No hay usuario');
          setAdsList([]);
          return;
        }
        
        const user = JSON.parse(storedUser);
        const userId = user.id || user.email;
        
        console.log('👤 Buscando publicidades para userId:', userId);
        console.log('👤 Usuario completo:', user);
        
        // Cargar publicidades desde Firestore (igual que GAdsListPage)
        const firestoreAds = await AdsFirestoreService.getUserAds(String(userId));
        console.log(`✅ ${firestoreAds.length} publicidades cargadas desde Firestore`);
        console.log('📦 Datos de Firestore:', firestoreAds);
        
        // Mapear a formato esperado por el componente
        const mappedAds: IGetAdResponse[] = firestoreAds.map((ad: any, index: number) => {
          // Manejar Timestamp de Firestore
          let dateString = new Date().toISOString();
          if (ad.createdAt) {
            if (typeof ad.createdAt === 'object' && 'seconds' in ad.createdAt) {
              dateString = new Date((ad.createdAt as any).seconds * 1000).toISOString();
            } else if (ad.createdAt instanceof Date) {
              dateString = ad.createdAt.toISOString();
            }
          }
          
          // IMPORTANTE: Los campos reales en Firestore son ad_title, ad_description, etc.
          return {
            id: index + 1, // ID numérico basado en índice
            firestoreId: ad.id, // ID de Firestore (string) para referencias
            title: ad.ad_title || ad.title || '', // ✅ Leer ad_title
            description: ad.ad_description || ad.description || '', // ✅ Leer ad_description
            size: ad.ad_size || ad.size || '1080x1080',
            create_date: dateString,
            deleted_date: null,
            account_id: parseInt(ad.userId || ad.accounts_account_id || '0'),
            ad_template: {
              id: 1,
              type: ad.ad_template?.disposition_pattern || ad.template || '',
              disposition_pattern: ad.ad_template?.disposition_pattern || ad.template || '',
              color_text: ad.ad_template?.color_text || ad.palette || '#000000',
            }
          };
        });
        
        console.log('📊 Publicidades mapeadas:', mappedAds.length);
        console.log('📊 Primera publicidad:', mappedAds[0]);
        console.log('📊 Todas las publicidades:', mappedAds);
        setAdsList(mappedAds);
        
      } catch (error) {
        console.error('❌ Error cargando publicidades:', error);
        setAdsList([]);
      }
    };

    fetchAds();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedFirestoreIds.length === 0) {
      setError({
        show: true,
        message:
          'Selecciona al menos un publicidad para que sea parte de tu estrategia de comunicación.',
      });
    } else {
      // Guardar los firestoreIds en lugar de los IDs numéricos
      console.log('💾 Guardando IDs de publicidades:', selectedFirestoreIds);
      dispatch(setNewStrategyAds(selectedFirestoreIds as any));
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.GROUPS}`
      );
      reset();
    }
  };

  const handleAdsSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    firestoreId: string
  ) => {
    const isChecked = e.target.checked;
    
    // Actualizar IDs numéricos (para UI)
    setSelectedNumbers((prevSelectedNumbers) => {
      if (isChecked) {
        return [...prevSelectedNumbers, id];
      } else {
        return prevSelectedNumbers.filter((number) => number !== id);
      }
    });
    
    // Actualizar firestoreIds (para guardar en estrategia)
    setSelectedFirestoreIds((prevIds) => {
      if (isChecked) {
        return [...prevIds, firestoreId];
      } else {
        return prevIds.filter((fid) => fid !== firestoreId);
      }
    });
  };

  const { handleSubmit, reset } = useForm<INewGoupInfo | {}>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-strategy-main">
      <div className="geco-strategy-nav-bar">
        <Link className="geco-strategy-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-strategy-nav-bar-section" to="/strategy">
          <GCircularButton
            icon={GStrategyIcon}
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
      <div className="geco-strategy-header-title">
        <GHeadSectionTitle
          title={CreateStrategyAdsTitle.title}
          subtitle={CreateStrategyAdsTitle.subtitle}
        />
      </div>

      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        {Array.isArray(adsList) && adsList.length !== 0 ? (
          <div className="geco-input-group">
            {adsList.map((ad) => (
              <div key={ad.id}>
                <div className="geco-strategy-item-card">
                  <div className="geco-strategy-item-body">
                    <h1 className="geco-strategy-item-name">{ad.title}</h1>
                    <div className="geco-strategy-item-info">
                      <p>{getDateString(ad.create_date)}</p>
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`strategy-${ad.id}`}
                    checked={selectedNumbers.includes(typeof ad.id === 'string' ? parseInt(ad.id) : ad.id)}
                    onChange={(e) => handleAdsSelection(
                      e, 
                      typeof ad.id === 'string' ? parseInt(ad.id) : ad.id,
                      ad.firestoreId || String(ad.id)
                    )}
                  />
                </div>
              </div>
            ))}
            {error.show && <span className="span-error">{error.message}</span>}
          </div>
        ) : (
          <div className="geco-strategy-empty">
            <Link to={'/ad'}>
              <div className="geco-strategys-empty">
                <p>{NewStrategyAdsEmpty}</p>
              </div>
            </Link>
          </div>
        )}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
          disabled={adsList.length === 0}
        />
      </form>
    </div>
  );
};
