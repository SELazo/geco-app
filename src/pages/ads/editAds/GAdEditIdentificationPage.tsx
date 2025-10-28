import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import {
  AdIdentificationHelp,
  CreateAdIdentificationTitle,
  EditAdIdentificationTitle,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useDispatch, useSelector } from 'react-redux';
import { AdsService } from '../../../services/external/adsService';
import { RootState } from '../../../redux/gecoStore';
import { IAd, IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { clearNewAdForm } from '../../../redux/sessionSlice';

type AdData = {
  titleHelper: string;
  descriptionHelper: string;
};

export const GAdEditIdentificationPage = () => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    titleHelper: Yup.string()
      .required(
        'Por favor ingrese un titulo identificativo para su publicidad, esto te ayudara a encontrarla para utillizarla en tus estrategias de comunicación.'
      )
      .max(40, 'El texto no puede tener más de 40 caracteres'),
    descriptionHelper: Yup.string()
      .required(
        'Por favor ingrese el mensaje con el cual se enviará la publicidad'
      )
      .max(500, 'El texto no puede tener más de 500 caracteres'),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const ad: IGetAdResponse = location && location.state;

  useEffect(() => {
    if (!ad || !ad.id || !ad.description || !ad.title) {
      navigate(`${ROUTES.AD.ROOT}`);
    }
  }, []);

  const onSubmit = async (data: AdData) => {
    const adId = typeof ad.id === 'string' ? parseInt(ad.id) : ad.id;
    const response = await AdsService.editAd(
      adId,
      data.titleHelper,
      data.descriptionHelper
    )
      .then(() => {
        navigate(
          `${ROUTES.AD.ROOT}${ROUTES.AD.EDIT.ROOT}${ROUTES.AD.EDIT.SUCCESS}`
        );
      })
      .catch(() => {
        navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.ERROR}`);
      });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    titleHelper: string;
    descriptionHelper: string;
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
          title={EditAdIdentificationTitle.title}
          subtitle={EditAdIdentificationTitle.subtitle}
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
                {...register('titleHelper')}
                placeholder="Nombre de la publicidad"
                defaultValue={ad.title}
                className={`input-box form-control ${
                  errors.titleHelper ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">{errors.titleHelper?.message}</span>
            </div>
            <div className="input-group">
              <textarea
                {...register('descriptionHelper')}
                placeholder="Escribe el mensaje que se adjuntará a la imagen de tu publicidad al difundirla."
                defaultValue={ad.description}
                className={`input-box form-control ${
                  errors.descriptionHelper ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">
                {errors.descriptionHelper?.message}
              </span>
            </div>

            <GSubmitButton
              label="Editar publicidad"
              colorBackground={GYellow}
              colorFont={GBlack}
            />
          </>
        )}
      </form>
    </div>
  );
};
