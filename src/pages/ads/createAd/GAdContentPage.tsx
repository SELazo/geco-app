import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import {
  AdContentHelp,
  CreateAdContentTitle,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { setNewAdContent } from '../../../redux/sessionSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../../redux/gecoStore';

type AdData = {
  titleAd?: string;
  textAd?: string;
};

export const GAdContentPage = () => {
  const formNewAd = useSelector((state: RootState) => state.formNewAd);

  const validationSchema = Yup.object().shape({
    titleAd: Yup.string(),
    textAd: Yup.string().max(
      500,
      'El texto no puede tener más de 500 caracteres'
    ),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!formNewAd || !formNewAd.template || !formNewAd.pallette) {
      console.error('formNewAd no está completo:', formNewAd);
      navigate(`${ROUTES.AD.ROOT}`);
      return;
    }
  }, [formNewAd]);

  const onSubmit = async (data: AdData) => {
    dispatch(setNewAdContent({ title: data.titleAd, text: data.textAd }));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.IMAGE_TYPE}`
    );
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    titleAd?: string;
    textAd?: string;
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
            title={AdContentHelp.title}
            body={AdContentHelp.body}
            body2={AdContentHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateAdContentTitle.title}
          subtitle={CreateAdContentTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('titleAd')}
            placeholder="Escribe el titulo principal"
            className="input-box form-control"
          />
        </div>
        <div className="input-group">
          <textarea
            {...register('textAd')}
            placeholder="Escribe cualquier texto adicional"
            className={`input-box form-control ${
              errors.textAd ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.textAd?.message}</span>
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
