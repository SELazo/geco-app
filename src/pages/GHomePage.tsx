import { Link, useNavigate } from 'react-router-dom';

import '../styles/ghome.css';
import { BlueYelowPalette, GRed, GWhite } from '../constants/palette';

import emailCampaign from '../assets/images/email_campaign_bro.svg';
import { GIcon } from '../components/GIcon';
import { GCircularButton } from '../components/GCircularButton';
import {
  GAdIcon,
  GContactsIcon,
  GPremiumStarIcon,
  GStatisticsIcon,
  GStrategyIcon,
  GUserIcon,
  GLogOutIcon
} from '../constants/buttons';
import { GLogoWord } from '../components/GLogoWord';
import { GHeadCenterTitle } from '../components/GHeadCenterTitle';
import {
  AdHeadCenterTitle,
  ContactsHeadCenterTitle,
  HomeHeadCenterTitle,
  StatisticsHeadCenterTitle,
  StrategyHeadCenterTitle,
} from '../constants/wording';
import { NavigationService } from '../services/navigationService/navigationService';

export const GHomePage = () => {

  return (
    <div className="home-main">
      <div className="home-head">
        <div className="home-head-header">
          <div className="home-head-header-logo">
            <GLogoWord />
          </div>
          <div className="home-head-header-nav-bar">

            <div className='home-head-header-nav-bar-logout'>
              <GIcon
                color={GLogOutIcon.color}
                icon-type={GLogOutIcon['icon-type']}/>
            </div>
            
            <button className="geco-without-background-btn">
              <Link to={'/user/pricing'}>
                <GIcon
                  color={GPremiumStarIcon.color}
                  icon-type={GPremiumStarIcon['icon-type']}
                />
              </Link>
            </button>

            <GCircularButton
              icon={GUserIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation('/user/info')}
            />
          </div>
        </div>
        <div className="home-head-img"></div>
      </div>

      <div className="home-body">
        <div className="home-body-title">
          <GHeadCenterTitle title={HomeHeadCenterTitle} color={GWhite} />
        </div>
        <div className="home-body-container-columns">
          <div className="geco-services-column">
            <div className="geco-services-icon">
              <GCircularButton
                icon={GAdIcon}
                size="2em"
                width="70px"
                height="70px"
                colorBackground={GWhite}
                onClickAction={NavigationService.handleNavigation('/ad')}
              />
              <p>{AdHeadCenterTitle}</p>
            </div>
            <div className="geco-services-icon">
              <GCircularButton
                icon={GStrategyIcon}
                size="2em"
                width="70px"
                height="70px"
                colorBackground={GWhite}
                onClickAction={NavigationService.handleNavigation('/strategy')}
              />
              <p>{StrategyHeadCenterTitle}</p>
            </div>
          </div>
          <div className="geco-services-column">
            <div className="geco-services-icon">
              <GCircularButton
                icon={GContactsIcon}
                size="2em"
                width="70px"
                height="70px"
                colorBackground={GWhite}
                onClickAction={NavigationService.handleNavigation(
                  '/contacts/options'
                )}
              />
              <p>{ContactsHeadCenterTitle}</p>
            </div>
            <div className="geco-services-icon">
              <GCircularButton
                icon={GStatisticsIcon}
                size="2em"
                width="70px"
                height="70px"
                colorBackground={GWhite}
                onClickAction={NavigationService.handleNavigation(
                  '/statistics/options'
                )}
              />
              <p>{StatisticsHeadCenterTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
