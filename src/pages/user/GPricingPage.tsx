import React from 'react';

import('../../styles/gpricing.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack, GIconButtonSignIn } from '../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { PricingSectionTitle } from '../../constants/wording';
import { GPricingCard, IPricing } from '../../components/GPricingCard';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const GPricingPage = () => {
  const pricingOptions: IPricing[] = [
    {
      topTitle: 'CUENTA',
      mainTitle: 'FREE',
      benefits: [
        { icon: 'check', description: '5 estrategias' },
        { icon: 'check', description: '5 imágenes inteligentes' },
        { icon: 'x', description: '5 grupos de contactos' },
      ],
      active: true,
      backgroundColor: GRed,
      buttonLabel: 'GRATIS',
      action: () => {
        console.log('Eligio cuenta free');
      },
    },
    {
      topTitle: 'CUENTA',
      mainTitle: 'PREMIUM',
      benefits: [
        { icon: 'check', description: '∞ estrategias' },
        { icon: 'check', description: '∞ imágenes inteligentes' },
        { icon: 'check', description: '∞ grupos de contactos' },
      ],
      active: true,
      backgroundColor: GYellow,
      buttonLabel: '$1500',
      action: () => {
        console.log('Eligio cuenta PREMIUM');
      },
    },
  ];
  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
  };

  return (
    <>
      <div className="geco-pricing-options">
        <div className="geco-pricing-header">
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
        <div className="geco-pricing-cards">
          <div className="geco-pricing-option">
            {pricingOptions.map((item, index) => (
              <GPricingCard key={`${index}-card`} pricing={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
