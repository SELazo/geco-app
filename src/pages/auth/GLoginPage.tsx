import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../styles/ginputBox.css';
import '../../styles/glogin.css';
import '../../styles/gform.css';

import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';

import { GSubmitButton } from '../../components/GSubmitButton';
import { GTextAction } from '../../components/GTextAction';
import {
  SignUpAction,
  ForgetPasswordAction,
  LoginHeadCenterTitle,
} from '../../constants/wording';
import { GLogoLetter } from '../../components/GLogoLetter';
import { GBlack, GWhite } from '../../constants/palette';

import { AuthService } from '../../services/authService/authService';
import { GChevronRightIcon } from '../../constants/buttons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Auth,
  SessionState,
  User,
  loginSuccess,
} from '../../redux/sessionSlice';
import { Users } from './GSignUpPage';

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
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    const response = await AuthService.login(data.email, data.password).catch (e => {
      setError('password', {
        type: 'manual',
        message: 'El correo electrónico o la contraseña son incorrectos',
      })
    });
    
    if (response && response.token){

      try {
        const validateSesion = await fetch('http://localhost:3000/validate-session',{
          method: 'GET',
          headers: {
            'authorization': response.token
          }
        });
        if (!validateSesion.ok) {
          throw new Error('Failed to validate session');
        }
        const data = await validateSesion.json();
        const user: User = data.user;

        const token = response.token;

        const auth: Auth = {
          token,
          isAuthenticated: true,
        };
        dispatch(loginSuccess({ user, auth }));

        reset();
        navigate('/home');

        localStorage.setItem('token',response.token);

      } catch (error) {
        throw new Error('Failed to validate session');
      }
      }else {
        setError('password', {
          type: 'manual',
          message: 'El correo electrónico o la contraseña son incorrectos',
        });
      };
 

      //if (response.ok) {
      //  const responseData = await response.json();
      //  const { token, user } = responseData;
//
      //  const auth: Auth = {
      //    token,
      //    isAuthenticated: true,
      //  };
//
      //  dispatch(loginSuccess({ user, auth }));
//
      //  reset();
      //  navigate('/home');
      //} else {
      //  setError('password', {
      //    type: 'manual',
      //    message: 'El correo electrónico o la contraseña son incorrectos',
      //  });
      //}
  };

  return (
    <div className="login-main">
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
    </div>
  );
};
