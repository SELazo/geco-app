import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import '../styles/ginputBox.css';
import '../styles/gform.css';

import { GHeadCenterTitle } from '../components/GHeadCenterTitle';

import { GSubmitButton } from '../components/GSubmitButton';
import { GTextAction } from '../components/GTextAction';
import {
  SignUpAction,
  ForgetPasswordAction,
  LoginHeadCenterTitle,
} from '../constants/wording';
import { GLogoLetter } from '../components/GLogoLetter';
import { GBlack, GWhite } from '../constants/palette';

import authService from '../services/authService';
import { GChevronRightIcon } from '../constants/buttons';

type LoginForm = {
  email: string;
  password: string;
};

export const GLoginPage = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Por favor ingrese un correo electrónico válido')
      .required('Por favor ingrese su correo electrónico'),
    password: Yup.string()
      .required('Por favor ingrese su contraseña')
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .max(40, 'La contraseña debe tener menos de 40 caracteres.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    //const token = await authService.login(data.email, data.password);
    //console.log('Token:', token);
    console.log(data);
    reset();
    handleContactsNavigate();
  };
  const navigate = useNavigate();
  const handleContactsNavigate = () => {
    navigate('/home');
  };

  return (
    <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
      <GLogoLetter />
      <GHeadCenterTitle title={LoginHeadCenterTitle} color={GBlack} />

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
      <GTextAction textAction={SignUpAction} />

      <GSubmitButton
        label="Sign In"
        icon={GChevronRightIcon}
        colorBackground={GBlack}
        colorFont={GWhite}
      />
      <GTextAction textAction={ForgetPasswordAction} />
    </form>
  );
};
