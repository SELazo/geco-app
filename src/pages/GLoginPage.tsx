import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../styles/ginputBox.css';
import '../styles/gform.css';
import { GHeadCenterTitle } from '../components/GHeadCenterTitle';

import { GSubmitButton } from '../components/GSubmitButton';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GTextAction } from '../components/GTextAction';
import {
  SignUpAction,
  ForgetPasswordAction,
  LoginHeadCenterTitle,
} from '../constants/wording';
import { GLogoLetter } from '../components/GLogoLetter';
import { GWhite } from '../constants/palette';

type LoginForm = {
  email: string;
  password: string;
};

export const GLoginPage = () => {
  const iconButtonSignIn: IButtonIcon = {
    'icon-type': 'chevron-right',
    color: GWhite,
  };

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

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    reset();
  };

  return (
    <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
      <GLogoLetter />
      <GHeadCenterTitle title={LoginHeadCenterTitle} />

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

      <GSubmitButton label="Sign In" icon={iconButtonSignIn} />
      <GTextAction textAction={ForgetPasswordAction} />
    </form>
  );
};
