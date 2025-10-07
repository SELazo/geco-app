import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gsignup.css';

import { GSubmitButton } from '../../../components/GSubmitButton';

import { GTextAction } from '../../../components/GTextAction';
import {
  SignUpHeadSectionTitle,
  SignInAction,
} from '../../../constants/wording';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack } from '../../../constants/buttons';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { useNavigate } from 'react-router-dom';
import AuthServiceFirestore from '../../../services/external/authServiceFirestore';
import { ROUTES } from '../../../constants/routes';

const { signUp } = AuthServiceFirestore;

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

const manualError = {
  type: 'manual',
  message: 'El correo electrónico está en uso',
};

export const GSignUpPage = () => {
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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUp(data.name, data.email, data.password)
      .then(() => {
        reset();
        navigate(ROUTES.SIGN_UP.SIGN_UP_SUCCESSFUL);
      })
      .catch((e: any) => setError('email', manualError));
  };

  return (
    <div className="signup-main">
      <div className="singup-head">
        <GCircularButton
          icon={GIconButtonBack}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.goBack}
        />
        <GHeadSectionTitle
          title={SignUpHeadSectionTitle.title}
          subtitle={SignUpHeadSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('name')}
            placeholder="Nombre completo"
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
          label="Crear"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
        <GTextAction textAction={SignInAction} />
      </form>
    </div>
  );
};
