import { FC } from 'react';

import('../styles/gpricingCard.css');

import { GSubmitButton } from './GSubmitButton';
import { GBlack, GWhite } from '../constants/palette';
import { GIcon } from './GIcon';

export interface IPricingBenefitsItem {
  icon: 'check' | 'x';
  description: string;
}

export interface IPricing {
  topTitle: string;
  mainTitle: string;
  benefits: IPricingBenefitsItem[];
  active: boolean;
  backgroundColor: string;
  buttonLabel: string;

  action: () => void;
}

interface IPricingCardProps {
  pricing: IPricing;
}

export const GPricingCard: FC<IPricingCardProps> = (
  props: IPricingCardProps
) => {
  return (
    <>
      <div
        className="geco-pricing-card"
        style={{ backgroundColor: props.pricing.backgroundColor }}
        onClick={props.pricing.action}
      >
        <h3>{props.pricing.topTitle}</h3>
        <h1>{props.pricing.mainTitle}</h1>
        {props.pricing.benefits.map((item, index) => (
          <div className="geco-pricing-item">
            <GIcon
              key={`${index}-benefit`}
              icon-type={item.icon}
              color={GWhite}
            />
            <p>{item.description}</p>
          </div>
        ))}
        <GSubmitButton
          colorBackground={GBlack}
          colorFont={GWhite}
          label={props.pricing.buttonLabel}
        />
      </div>
    </>
  );
};
