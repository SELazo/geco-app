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
import { AdsService } from '../../../services/external/adsService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { AdHeadCenterTitle } from '../../../constants/wording';
import { GAdListItem } from '../../../components/GAdListItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link, useNavigate } from 'react-router-dom';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { ROUTES } from '../../../constants/routes';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { GPopUpMessage } from '../../../components/GPopUpMessage';

const { getAds, deleteAd } = AdsService;

export const GAdsListPage = () => {
  const [ads, setAds] = useState<IGetAdResponse[]>([]);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isDeleteErrorPopupOpen, setDeleteErrorPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await getAds();
        const adsData = response as ApiResponse<IGetAdResponse[]>;
        setAds(adsData.data ?? []);
      } catch (error) {
        console.error(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchAds();
  }, []);

  const viewAd = (id: number) => {
    navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.LIST.VIEW}`, {
      state: ads.find((ad) => ad.id === id),
    });
  };

  const handleDeleteAd = async () => {
    if (selectedId !== null) {
      await deleteAd(selectedId)
        .then((response) => {
          if (response.success) {
            window.location.reload();
          }
        })
        .catch(() => {
          setDeletePopupOpen(false);
          setDeleteErrorPopupOpen(true);
        });
    }
  };

  const handleDelete = (id: number) => {
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
        {ads.length > 0 && (
          <div className="geco-ads-list-container">
            <div className="geco-ads-list-ul">
              <div className="geco-ads-list-item">
                {ads.map((item) => (
                  <GAdListItem
                    key={item.id}
                    ad={item}
                    icon={GViewIcon}
                    iconBackgroundColor={GYellow}
                    onClickAction={() => viewAd(item.id)}
                    icon2={GDeletetIcon}
                    iconBackgroundColor2={GRed}
                    onClickAction2={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {ads.length === 0 && (
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
