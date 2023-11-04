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
import { IAd } from '../../../interfaces/dtos/external/IAds';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { clearNewAdForm } from '../../../redux/sessionSlice';

type AdData = {
  titleHelper: string;
  descriptionHelper?: string;
};

export const GAdIdentificationPage = () => {
  const [loading, setLoading] = useState(false);
  const formNewAd = useSelector((state: RootState) => state.auth.formNewAd);
  const validationSchema = Yup.object().shape({
    titleHelper: Yup.string().required(
      'Por favor ingrese un titulo identificativo para su publicidad, esto te ayudara a encontrarla para utillizarla en tus estrategias de comunicación.'
    ),
    descriptionHelper: Yup.string()
      .optional()
      .max(500, 'El texto no puede tener más de 500 caracteres'),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const base64Ad = location && location.state;

  useEffect(() => {
    if (!formNewAd.template || !formNewAd.pallette || !base64Ad) {
      navigate(`${ROUTES.AD.ROOT}`);
    }
  }, []);

  const onSubmit = async (data: AdData) => {
    const adInfo = { ...formNewAd };
    const newAd: IAd = {
      title: data.titleHelper,
      description: data.descriptionHelper ? data.descriptionHelper : '',
      size: adInfo.size,
      ad_template: {
        color_text: adInfo.pallette,
        type: adInfo.size,
        disposition_pattern: adInfo.template.id,
      },
    };
    setLoading(true);
    const response = await AdsService.postGenerateAd(newAd);
    if (!response) {
      navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.ERROR}`);
    }
    const sendImgResponse = await AdsService.sendBase64InChunks(
      base64Ad.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
      response.data?.id!
    );

    if (!sendImgResponse) {
      navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.ERROR}`);
    }
    setLoading(false);
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.SUCCESS}`
    );
    reset();
    dispatch(clearNewAdForm());
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    titleHelper: string;
    descriptionHelper?: string;
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
                {...register('titleHelper')}
                placeholder="Nombre de la publicidad"
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
                className={`input-box form-control ${
                  errors.descriptionHelper ? 'is-invalid' : ''
                }`}
              />
              <span className="span-error">
                {errors.descriptionHelper?.message}
              </span>
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
