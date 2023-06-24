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

import { AuthService } from '../../services/external/authService';
import { SessionService } from '../../services/internal/sessionService';
import { GChevronRightIcon } from '../../constants/buttons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Auth,
  User,
  loginSuccess,
} from '../../redux/sessionSlice';
import { ILoginResponse, IValidateSessionResponse } from '../../interfaces/dtos/external/IAuth';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { ROUTES } from '../../constants/routes';

const { login, validateSession } = AuthService;
const { setToken, getToken } = SessionService;

type LoginForm = {
  email: string;
  password: string;
};

export const GLoginPage = ({ handleLogin }: { handleLogin: () => void }) => {
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

  const manualError = {
    type: 'manual',
    message: 'El correo electrónico o la contraseña son incorrectos',
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onSubmit = async ({ email, password }: LoginForm) => {
    await login(email, password)
      .then(async (response: ApiResponse<ILoginResponse>) => {
          const loginResponse = response.data as ILoginResponse;
          setToken(loginResponse.token);

          return await validateSession();
      })
      .then(async (response: ApiResponse<IValidateSessionResponse>) => {
        const session = response.data as IValidateSessionResponse;
        const user: User = session.user;
        const token = getToken();

        const auth: Auth = {
          token,
          isAuthenticated: true,
        };
        dispatch(loginSuccess({ user, auth }));

        reset();
        handleLogin();
        navigate(ROUTES.HOME);
      })
      .catch (e => {
          setError('password', manualError);
      });
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
