import React from 'react';

import('../../styles/gpricing.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack, GIconButtonSignIn } from '../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { PricingSectionTitle } from '../../constants/wording';
import { GPricingCard, IPricing } from '../../components/GPricingCard';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const GPricingPage = () => {
  const pricingOptions: IPricing[] = [
    {
      idPricing: 0,
      topTitle: 'CUENTA',
      mainTitle: 'FREE',
      benefits: [
        { idBenefit: 0, icon: 'check', description: '5 estrategias' },
        { idBenefit: 1, icon: 'check', description: '5 imágenes inteligentes' },
        { idBenefit: 2, icon: 'x', description: '5 grupos de contactos' },
      ],
      active: true,
      backgroundColor: GRed,
      buttonLabel: 'GRATIS',
      idTerms: 1,
    },
    {
      idPricing: 1,
      topTitle: 'CUENTA',
      mainTitle: 'PREMIUM',
      benefits: [
        { idBenefit: 3, icon: 'check', description: '∞ estrategias' },
        { idBenefit: 4, icon: 'check', description: '∞ imágenes inteligentes' },
        { idBenefit: 5, icon: 'check', description: '∞ grupos de contactos' },
      ],
      active: true,
      backgroundColor: GYellow,
      buttonLabel: '$1500',
      idTerms: 2,
    },
  ];

  return (
    <div className="geco-pricing-main">
      <div className="geco-pricing-header">
        <div className="geco-pricing-header-nav-bar">
          <Link className="geco-pricing-header-nav-bar-logo" to="/home">
            <GLogoLetter />
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
        <div className="geco-pricing-title">
          <GHeadCenterTitle title={PricingSectionTitle} color={GBlack} />
        </div>
      </div>
      <div className="geco-pricing-cards">
        <div className="geco-pricing-option">
          {pricingOptions.map((item) => (
            <GPricingCard key={item.idPricing} pricing={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
