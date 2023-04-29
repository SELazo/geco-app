import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../styles/ginputBox.css';
import '../styles/gform.css';

import { GHeadSectionTitle } from '../components/GHeadSectionTitle';
import { GCircularButton } from '../components/GCircularButton';
import { GIconButtonBack, GIconButtonSignIn } from '../constants/buttons';

import { GSubmitButton } from '../components/GSubmitButton';
import { ForgotPasswordHeadSectionTitle } from '../constants/wording';
import { GBlack, GWhite, GYellow } from '../constants/palette';
import { NavigationService } from '../services/navigationService';

type ForgotPasswordFormData = {
  email: string;
};

export const GForgotPasswordPage = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Por favor ingrese un correo electrónico válido')
      .required('Por favor ingrese su correo electrónico'),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log(data);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <>
      <div style={{ margin: '15px' }}>
        <GCircularButton
          icon={GIconButtonBack}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.goBack}
        />
        <GHeadSectionTitle
          title={ForgotPasswordHeadSectionTitle.title}
          subtitle={ForgotPasswordHeadSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            className={`input-box form-control ${
              errors.email ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.email?.message}</span>
        </div>
        <GSubmitButton
          label="Enviar"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </>
  );
};
