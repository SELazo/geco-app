import { FC, useEffect, useState } from 'react';

import('../styles/gstrategyItem.css');

import { IGroup } from '../interfaces/dtos/external/IGroups';
import { IGetAdResponse } from '../interfaces/dtos/external/IAds';
import { GroupsService } from '../services/external/groupsService';
import { AdsService } from '../services/external/adsService';
import { StrategyService } from '../services/internal/strategyService';
import dayjs from 'dayjs';
import { GBlack, GWhite, GYellow } from '../constants/palette';
import { GPopUpMessage } from './GPopUpMessage';
import { StrategiesService } from '../services/external/strategiesService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const { getGroups } = GroupsService;
const { getAds } = AdsService;
const { getPeriodicity } = StrategyService;
const { deleteStrategy, sendStrategy } = StrategiesService;

export interface IStrategyProps {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  periodicity: string;
  schedule: string;
  ads: number[];
  groups: number[];
}

export const GStrategyCard: FC<IStrategyProps> = (props: IStrategyProps) => {
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isSendPopupOpen, setSendPopupOpen] = useState(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      if (props) {
        try {
          const groups: IGroup[] = [];
          const groupsData = await getGroups();
          const ads: IGetAdResponse[] = [];
          const adsData = await getAds();

          if (props.ads && props.ads.length > 0 && adsData.data) {
            adsData.data.map((ad) => {
              const findAd = props.ads.find((adId) => adId === ad.id);

              if (findAd) {
                ads.push(ad);
              }
            });
          }
          if (props.groups && props.groups.length > 0) {
            groupsData.map((group) => {
              const findGroup = props.groups.find(
                (groupId) => groupId === group.id
              );

              if (findGroup) {
                groups.push(group);
              }
            });
          }

          setGroupsList(groups);
          setAdsList(ads);
        } catch (error) {
          console.log(error); // TODO: Mostrar error en pantalla
        }
      }
    };

    fetchGroups();
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
    await sendStrategy(props.id);
  };

  const handleDeleteStrategy = async () => {
    await deleteStrategy(props.id).then((response) => {
      console.log(response);
      if (response.success) {
        window.location.reload();
      }
    });
  };

  return (
    <div className="geco-strategy-resume" style={{ marginBottom: '10px' }}>
      <h3 className="geco-strategy-resume-title">{props.name.toUpperCase()}</h3>
      <div>
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
