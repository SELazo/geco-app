import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GIconButtonBack,
  GStrategyIcon,
} from '../../../constants/buttons';

import {
  AdIdentificationHelp,
  CreateAdIdentificationTitle,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useState } from 'react';
import { PacmanLoader } from 'react-spinners';

export const GStrategyInformationPage = () => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(
        'Por favor ingrese un titulo identificativo para su estrategia de comunicación, esto te ayudara a encontrarla para realizar modificaciones posteriores.'
      )
      .max(50, 'El título no puede tener más de 50 caracteres'),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    //request
    setLoading(false);
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.SUCCESS}`
    );
    reset();
  };

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

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-add-contact-excel-nav-bar-section" to="/ad">
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
            title={AdIdentificationHelp.title}
            body={AdIdentificationHelp.body}
            body2={AdIdentificationHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateAdIdentificationTitle.title}
          subtitle={CreateAdIdentificationTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        {loading ? (
          <div
            style={{
              textAlign: 'start',
              marginTop: '25vh',
            }}
          >
            <PacmanLoader color={GYellow} />
          </div>
        ) : (
          <>
            <div className="input-group">
              <input
                type="text"
                {...register('title')}
                placeholder="Nombre de la publicidad"
                className={`input-box form-control ${
                  errors.title ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">{errors.title?.message}</span>
            </div>

            <GSubmitButton
              label="Crear publicidad"
              colorBackground={GYellow}
              colorFont={GBlack}
            />
          </>
        )}
      </form>
    </div>
  );
};
