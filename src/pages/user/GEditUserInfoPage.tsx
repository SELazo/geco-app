import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../styles/ginputBox.css';
import '../../styles/gform.css';

import { GSubmitButton } from '../../components/GSubmitButton';

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack, GUserIcon } from '../../constants/buttons';
import { GBlack, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { User, setUser } from '../../redux/authSlice';
import { Users } from '../auth/GSignUpPage';
import { useNavigate } from 'react-router-dom';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const GEditUserInfoPage = () => {
  let user: User = useSelector((state: any) => state.auth.user as User);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Por favor ingrese un nombre completo.'),
    email: Yup.string()
      .email('Por favor ingrese un correo electrónico válido')
      .required('Por favor ingrese su correo electrónico'),
    password: Yup.string()
      .required('Por favor ingrese su contraseña')
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .max(40, 'La contraseña debe tener menos de 40 caracteres.'),
    confirmedPassword: Yup.string()
      .required('Por favor confirme su contraseña.')
      .oneOf([Yup.ref('password')], 'La contraseña no coincide.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    /**temporal */
    const dataBase = JSON.parse(
      localStorage.getItem('users') || '[]'
    ) as Users[];

    const newInfoUser: Users = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    dataBase[user.id] = newInfoUser;

    dispatch(
      setUser({ id: user.id, name: newInfoUser.name, email: newInfoUser.email })
    );
    localStorage.setItem('users', JSON.stringify(dataBase));
    reset();
  };

  return (
    <div className="geco-user-page">
      <div className="geco-user-header">
        <div className="geco-user-nav">
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.goBack}
          />
        </div>
        <GCircularButton
          icon={GUserIcon}
          size="3em"
          width="100px"
          height="100px"
          colorBackground={GWhite}
        />
        <GHeadCenterTitle title={user.name} color={GWhite} />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('name')}
            placeholder={user.name}
            className={`input-box form-control ${
              errors.name ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.name?.message}</span>
        </div>
        <div className="input-group">
          <input
            type="email"
            {...register('email')}
            placeholder={user.email}
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
          label="Modificar"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
