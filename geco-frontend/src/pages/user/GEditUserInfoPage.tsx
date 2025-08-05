import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../styles/ginputBox.css';
import '../../styles/gform.css';
import '../../styles/gedituser.css';

import { GSubmitButton } from '../../components/GSubmitButton';

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack, GUserIcon } from '../../constants/buttons';
import { GBlack, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { AuthService } from '../../services/external/authService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { User, setUser } from '../../redux/sessionSlice';
import { Link, useNavigate } from 'react-router-dom';
import { UserEditInfoSubtitle } from '../../constants/wording';
import { GLogoLetter } from '../../components/GLogoLetter';
import { IUser } from '../../interfaces/dtos/external/IUser';
import { ROUTES } from '../../constants/routes';

const { editUser } = AuthService;

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
};

export const GEditUserInfoPage = () => {
  let user: User = useSelector((state: any) => state.auth.user as User);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const onSubmit = async (data: SignUpFormData) => {
    const userData: IUser = {
      id: user.id,
      name: data.name,
      email: data.email,
      password: data.password
    }

    await editUser(userData)
      .then(() => {
        dispatch(
          setUser({id: userData.id, name: userData.name, email: userData.email})
        );
        reset();
        navigate(ROUTES.USER.EDIT_SUCCESS);
      })
      .catch(e => console.log(e)) // TODO: Mostrar error en pantalla
  };

  return (
    <div className="geco-edit-user-page">
      <div className="geco-edit-user-header">
        <div className="geco-edit-user-header-nav-bar">
          <Link className="geco-edit-user-header-nav-bar-logo" to="/home">
            <GLogoLetter />
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
        <div className="geco-edit-user-info">
          <GCircularButton
            icon={GUserIcon}
            size="3em"
            width="100px"
            height="100px"
            colorBackground={GWhite}
          />
          <GHeadCenterTitle title={user.name} color={GWhite} />
        </div>
      </div>
      <div className="geco-edit-user-form">
        <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="geco-user-edit-subtitle">
            <p>{UserEditInfoSubtitle}</p>
          </div>
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
    </div>
  );
};
