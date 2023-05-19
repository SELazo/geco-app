import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/grecovery.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonSignIn, GIconButtonX } from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { ResetPasswordHeadSectionTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/navigationService';

type ResetPasswordFormData = {
  password: string;
  confirmedPassword: string;
};

export const GResetPasswordPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Por favor ingrese su contraseña')
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .max(40, 'La contraseña debe tener menos de 40 caracteres.'),
    confirmedPassword: Yup.string()
      .required('Por favor confirme su contraseña.')
      .oneOf([Yup.ref('password')], 'La contraseña no coincide.'),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log(data);
    reset();
    navigate('/recovery/reset-success');
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className='recovery-main'>
      <div className='recovery-head'>
        <GCircularButton
          icon={GIconButtonX}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.handleNavigation('/login')}
        />
        <GHeadSectionTitle
          title={ResetPasswordHeadSectionTitle.title}
          subtitle={ResetPasswordHeadSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="password"
            {...register('password')}
            placeholder="Contraseña"
            className={`input-box form-control ${
              errors.password ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.password?.message}</span>
        </div>
        <div className="input-group">
          <input
            type="password"
            {...register('confirmedPassword')}
            placeholder="Repita su contraseña"
            className={`input-box form-control ${
              errors.confirmedPassword ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">
            {errors.confirmedPassword?.message}
          </span>
        </div>
        <GSubmitButton
          label="Confirmar"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
