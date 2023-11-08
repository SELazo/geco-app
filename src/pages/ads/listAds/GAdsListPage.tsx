import('../../../styles/gads.css');

import { useEffect, useState } from 'react';

import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { AdsService } from '../../../services/external/adsService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { AdHeadCenterTitle } from '../../../constants/wording';
import { GAdListItem, IAdListItem } from '../../../components/GAdListItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { ROUTES } from '../../../constants/routes';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';

const { getAds } = AdsService;

export const GAdsListPage = () => {
  const [ads, setAds] = useState<IGetAdResponse[]>([]);

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
  }, [ads]);

  const viewAd = (id: number) => {
    console.log(ads.find((c) => c.id === id));
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
                    icon={GEditIcon}
                    iconBackgroundColor={GYellow}
                    onClickAction={() => viewAd(item.id)}
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
    </>
  );
};
