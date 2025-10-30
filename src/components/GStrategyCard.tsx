import { FC, useEffect, useState } from 'react';

import('../styles/gstrategyItem.css');

import { IGroup } from '../interfaces/dtos/external/IGroups';
import { IGetAdResponse } from '../interfaces/dtos/external/IAds';
import { GroupsService } from '../services/external/groupsService';
import { GroupsServiceFirestore } from '../services/external/groupsServiceFirestore';
import { AdsService } from '../services/external/adsService';
import { AdsFirestoreService } from '../services/external/adsFirestoreService';
import { StrategyService } from '../services/internal/strategyService';
import dayjs from 'dayjs';
import { GBlack, GWhite, GYellow } from '../constants/palette';
import { GPopUpMessage } from './GPopUpMessage';
import { StrategiesService } from '../services/external/strategiesService';
import { StrategiesFirestoreService } from '../services/external/strategiesFirestoreService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const { getGroups } = GroupsService;
const { getAds } = AdsService;
// Usar servicios de Firestore para obtener datos actuales
const { getPeriodicity } = StrategyService;
const { sendStrategy } = StrategiesService;

export interface IStrategyProps {
  id: number;
  firestoreId?: string; // ID de Firestore para operaciones
  name: string;
  start_date: Date;
  end_date: Date;
  periodicity: string;
  schedule: string;
  ads: (number | string)[]; // ✅ Aceptar IDs de Firestore (strings) o numéricos
  groups: (number | string)[]; // ✅ Aceptar IDs de Firestore (strings) o numéricos
}

export const GStrategyCard: FC<IStrategyProps> = (props: IStrategyProps) => {
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isSendPopupOpen, setSendPopupOpen] = useState(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (props) {
        try {
          console.log('🔍 Cargando datos para tarjeta de estrategia...');
          console.log('📋 IDs de publicidades:', props.ads);
          console.log('📋 IDs de grupos:', props.groups);
          
          const groups: IGroup[] = [];
          const ads: IGetAdResponse[] = [];

          // Obtener publicidades desde Firestore
          if (props.ads && props.ads.length > 0) {
            console.log('📦 Obteniendo publicidades desde Firestore...');
            console.log('📦 IDs de publicidades a buscar:', props.ads);
            // Obtener todas las publicidades del usuario desde localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const user = JSON.parse(storedUser);
              const userId = user.id || user.email;
              console.log('👤 Usuario ID para buscar publicidades:', userId);
              const allAds = await AdsFirestoreService.getUserAds(String(userId));
              console.log('📦 Total de publicidades encontradas:', allAds.length);
              console.log('📦 Todas las publicidades:', allAds);
              
              // Filtrar solo las que están en la estrategia
              props.ads.forEach((adId: number | string) => {
                const adIdStr = String(adId);
                console.log('🔍 Buscando publicidad con ID:', adIdStr);
                const foundAd = allAds.find(ad => {
                  console.log('   Comparando con ad.id:', ad.id);
                  return ad.id === adIdStr;
                });
                if (foundAd && foundAd.id) {
                  // Manejar ambos formatos: nuevo (title) y viejo (ad_title)
                  const adData = foundAd as any;
                  const title = foundAd.title || adData.ad_title || 'Sin título';
                  const description = foundAd.description || adData.ad_description || '';
                  const size = foundAd.size || adData.ad_size || '';
                  
                  // Manejar fecha con seguridad
                  let createDate: string;
                  try {
                    if (foundAd.createdAt) {
                      const date = foundAd.createdAt instanceof Date 
                        ? foundAd.createdAt 
                        : new Date(foundAd.createdAt);
                      createDate = date.toISOString();
                    } else if (adData.ad_create_date) {
                      const date = adData.ad_create_date instanceof Date
                        ? adData.ad_create_date
                        : new Date(adData.ad_create_date);
                      createDate = date.toISOString();
                    } else {
                      createDate = new Date().toISOString();
                    }
                  } catch (e) {
                    console.warn('⚠️ Fecha inválida, usando fecha actual');
                    createDate = new Date().toISOString();
                  }
                  
                  console.log('✅ Publicidad encontrada:', title, '| Estructura:', foundAd.title ? 'nueva (title)' : 'vieja (ad_title)');
                  ads.push({
                    id: parseInt(foundAd.id.slice(-6), 16) || 0,
                    title: title,
                    description: description,
                    size: size,
                    create_date: createDate,
                    deleted_date: null,
                    account_id: 0,
                    ad_template: { id: 1, type: '', disposition_pattern: '', color_text: '' }
                  });
                } else {
                  console.log('❌ NO encontrada publicidad con ID:', adIdStr);
                }
              });
            }
          }
          
          // Obtener grupos desde Firestore
          if (props.groups && props.groups.length > 0) {
            console.log('👥 Obteniendo grupos desde Firestore...');
            const allGroups = await GroupsServiceFirestore.getGroups();
            console.log('👥 Total de grupos encontrados:', allGroups.length);
            
            // Filtrar solo los que están en la estrategia
            props.groups.forEach((groupId: number | string) => {
              const groupIdStr = String(groupId);
              const foundGroup = allGroups.find(g => String(g.id) === groupIdStr);
              if (foundGroup) {
                console.log('✅ Grupo encontrado:', foundGroup.name);
                groups.push(foundGroup);
              }
            });
          }

          console.log('✅ Publicidades cargadas:', ads.length);
          console.log('✅ Grupos cargados:', groups.length);
          setGroupsList(groups);
          setAdsList(ads);
        } catch (error) {
          console.error('❌ Error cargando datos de estrategia:', error);
        }
      }
    };

    fetchData();
  }, [props]);

  const handleEdit = () => {
    navigate(
      `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.INFORMATION}`,
      { state: props }
    );
  };

  const handleDelete = () => {
    setDeletePopupOpen(true);
  };

  const handleSend = () => {
    setSendPopupOpen(true);
  };

  const handleSendStrategy = async () => {
    try {
      const response = await sendStrategy(props.id);
      console.log('Estrategia enviada:', response);
      if (response && response.success) {
        setSendPopupOpen(false);
        // Aquí podrías mostrar un mensaje de éxito o actualizar el estado
        alert('Estrategia enviada exitosamente!');
      } else {
        console.error('Error al enviar estrategia:', response);
        alert('Error al enviar la estrategia');
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert('Error al enviar la estrategia');
    }
  };

  const handleDeleteStrategy = async () => {
    try {
      const strategyId = props.firestoreId || props.id.toString();
      console.log('🗑️ Eliminando estrategia:', strategyId);
      
      await StrategiesFirestoreService.deleteStrategy(strategyId);
      console.log('✅ Estrategia eliminada exitosamente');
      
      setDeletePopupOpen(false);
      // Recargar la página actual para actualizar la lista
      window.location.reload();
    } catch (error) {
      console.error('❌ Error eliminando estrategia:', error);
      alert('Error al eliminar la estrategia');
    }
  };

  return (
    <div className="geco-strategy-resume" style={{ marginBottom: '10px' }}>
      <h3 className="geco-strategy-resume-title">{props.name.toUpperCase()}</h3>
      <div style={{ justifyItems: 'left' }}>
        <div className="geco-strategy-resume-item">
          <p className="geco-strategy-resume-item-title">Publicidades:</p>
          {adsList &&
            adsList.map((ad) => (
              <p
                key={`strategyAd${ad.id}`}
                className="geco-strategy-resume-item-list"
              >
                • {ad.title}
              </p>
            ))}
        </div>
        <div className="geco-strategy-resume-item">
          <p className="geco-strategy-resume-item-title">Grupos:</p>

          {groupsList &&
            groupsList.map((group) => (
              <p
                key={`strategyGroup${group.id}`}
                className="geco-strategy-resume-item-list"
              >
                • {group.name}
              </p>
            ))}
        </div>
        <div className="geco-strategy-resume-item">
          <p className="geco-strategy-resume-item-title">Duración:</p>
          <p className="geco-strategy-resume-item">
            {dayjs(props.start_date).format('DD/MM/YYYY')}
            {' - '}
            {dayjs(props.end_date).format('DD/MM/YYYY')}
          </p>
        </div>
        <div>
          <p className="geco-strategy-resume-item-title">Difusión:</p>
          <p className="geco-strategy-resume-item">{props.schedule}</p>
        </div>
        <div className="geco-strategy-resume-item">
          <p className="geco-strategy-resume-item-title">Periodicidad:</p>
          <p className="geco-strategy-resume-item">
            {getPeriodicity(props.periodicity)}
          </p>
        </div>
      </div>
      <div className="geco-strategy-buttons">
        <button className="geco-strategy-btn-options" onClick={handleEdit}>
          Editar
        </button>
        <button
          className="geco-strategy-btn-options"
          style={{ backgroundColor: GBlack, color: GWhite }}
          onClick={handleDelete}
        >
          Borrar
        </button>
        <button
          className="geco-strategy-btn-options"
          style={{ backgroundColor: GYellow, color: GWhite }}
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>

      {isDeletePopupOpen && (
        <GPopUpMessage
          isOpen={isDeletePopupOpen}
          title="¿Estás seguro de borrar esta estrategia?"
          body="Una estrategia borrada no será posible de recuperar."
          btn1="Confirmar"
          btn1Action={() => {
            handleDeleteStrategy();
            setDeletePopupOpen(false);
          }}
          btn2="Cancelar"
          btn2Action={() => {
            setDeletePopupOpen(false);
          }}
        />
      )}

      {isSendPopupOpen && (
        <GPopUpMessage
          isOpen={isSendPopupOpen}
          title="Enviar"
          body="¿Está seguro de enviar esta estrategia?"
          btn1="Enviar"
          btn1Action={() => {
            handleSendStrategy();
            setSendPopupOpen(false);
          }}
          btn2="Cancelar"
          btn2Action={() => setSendPopupOpen(false)}
        />
      )}
    </div>
  );
};
