import { FC } from 'react';

import('../styles/gpricingCard.css');

import { GSubmitButton } from './GSubmitButton';
import { GBlack, GWhite } from '../constants/palette';
import { GIcon } from './GIcon';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setIdTerms } from '../redux/sessionSlice';

export interface IPricingBenefitsItem {
  idBenefit: number;
  icon: 'check' | 'x';
  description: string;
}

export interface IPricing {
  idPricing: number;
  topTitle: string;
  mainTitle: string;
  benefits: IPricingBenefitsItem[];
  active: boolean;
  backgroundColor: string;
  buttonLabel: string;
  idTerms: number;
}

interface IPricingCardProps {
  pricing: IPricing;
}

export const GPricingCard: FC<IPricingCardProps> = (
  props: IPricingCardProps
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickAction = () => {
    dispatch(setIdTerms(props.pricing.idTerms));
    navigate('/user/pricing/terms');
  };

  return (
    <>
      <div
        className="geco-pricing-card"
        style={{ backgroundColor: props.pricing.backgroundColor }}
        onClick={onClickAction}
      >
        <h3>{props.pricing.topTitle}</h3>
        <h1>{props.pricing.mainTitle}</h1>
        <div className="geco-pricing-items">
          {props.pricing.benefits.map((item) => (
            <div key={item.idBenefit} className="geco-pricing-item">
              <GIcon icon-type={item.icon} color={GWhite} />
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <GSubmitButton
          colorBackground={GBlack}
          colorFont={GWhite}
          label={props.pricing.buttonLabel}
        />
      </div>
    </>
  );
};
