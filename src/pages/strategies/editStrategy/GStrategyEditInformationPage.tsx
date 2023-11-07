import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';

import {
  CreateStrategyInformationTitle,
  EditStrategyInformationTitle,
  StrategyInformationHelp,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useDispatch } from 'react-redux';
import { setNewStrategyTitle } from '../../../redux/sessionSlice';
import { IStrategyProps } from '../../../components/GStrategyCard';
import { useEffect } from 'react';

export const GStrategyEditInformationPage = () => {
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(
        'Por favor ingrese un titulo identificativo para su estrategia de comunicación, esto te ayudara a encontrarla para realizar modificaciones posteriores.'
      )
      .max(50, 'El título no puede tener más de 50 caracteres'),
  });

  const navigate = useNavigate();
  const location = useLocation();
  let strategyToEdit: IStrategyProps = location && location.state;

  useEffect(() => {
    if (!strategyToEdit) {
      navigate(`${ROUTES.STRATEGY.ROOT}`);
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    title: string;
  }>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    strategyToEdit = { ...strategyToEdit, name: data.title };
    navigate(
      `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.ADS}`,
      { state: strategyToEdit }
    );
    reset();
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link
            className="geco-add-contact-excel-nav-bar-section"
            to="/strategy"
          >
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
        <div className="geco-create-ad-nav-bar-right">
          <GDropdownHelp
            title={StrategyInformationHelp.title}
            body={StrategyInformationHelp.body}
            body2={StrategyInformationHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={EditStrategyInformationTitle.title}
          subtitle={EditStrategyInformationTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('title')}
            placeholder="Nombre de la estrategia"
            defaultValue={strategyToEdit ? strategyToEdit.name : ''}
            className={`input-box form-control ${
              errors.title ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.title?.message}</span>
        </div>

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
