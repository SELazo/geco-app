import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../styles/ginputBox.css';
import '../../styles/gform.css';
import '../../styles/gcommentsPage.css';

import { GHeadSectionTitle } from '../../components/GHeadSectionTitle';
import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';

import { GSubmitButton } from '../../components/GSubmitButton';
import { CommentsHeadSectionTitle } from '../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { useSelector } from 'react-redux';
import { User } from '../../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';

type CommentsFormData = {
  message: string;
};

export const GCommentsPage = () => {
  const validationSchema = Yup.object().shape({
    message: Yup.string().required('Por favor ingrese un mensaje').max(500),
  });
  const user: User = useSelector((state: any) => state.auth.user as User);
  const navigate = useNavigate();

  const onSubmit = (data: CommentsFormData) => {
    console.log(user.email);
    console.log(data);
    //llamada al servicio
    //si okey
    reset();
    navigate('/user/message-sended');
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentsFormData>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="commentsPage-main">
      <div className="geco-comments-header-nav-bar">
        <Link className="geco-comments-header-nav-bar-logo" to="/home">
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
      <div className="geco-comments-header-title">
        <GHeadSectionTitle
          title={CommentsHeadSectionTitle.title}
          subtitle={CommentsHeadSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <textarea
            {...register('message')}
            placeholder="Escribe tu mensaje"
            className={`input-box form-control ${
              errors.message ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.message?.message}</span>
        </div>
        <GSubmitButton
          label="Enviar"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
