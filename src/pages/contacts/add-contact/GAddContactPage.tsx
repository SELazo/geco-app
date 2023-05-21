import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddcontact.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack } from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { AddContactSectionTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/navigationService';
import { useSelector } from 'react-redux';
import { User } from '../../../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { IContactData } from '../../../interfaces/IContact';

export const GAddContactPage = () => {
  const validationSchema = Yup.object().shape({
    hasContactInfo: Yup.boolean(),
    name: Yup.string().required('Por favor ingrese un nombre completo.'),
    email: Yup.string().email('Por favor ingrese un correo electrónico válido'),
    cellphone: Yup.string()
      .test(
        'has-contact-info',
        'Por favor ingrese al menos un correo electrónico o número de celular',
        function (value) {
          const { email, cellphone } = this.parent;
          if (!email && !cellphone) {
            return false;
          }
          return true;
        }
      )
      .matches(
        /^\+[0-9]{1,3}\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{4}$/,
        'Por favor ingrese un número de celular válido'
      ),
  });

  const navigate = useNavigate();

  const onSubmit = (data: IContactData) => {
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
  } = useForm<IContactData>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-add-contact-main">
      <div className="geco-add-contact-nav-bar">
        <Link className="geco-add-contact-nav-bar-logo" to="/home">
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
      <div className="geco-add-contact-header-title">
        <GHeadSectionTitle
          title={AddContactSectionTitle.title}
          subtitle={AddContactSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('name')}
            placeholder="Nombre del contacto"
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
            placeholder="Email del contacto"
            className={`input-box form-control ${
              errors.email ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.email?.message}</span>
        </div>
        <div className="input-group">
          <input
            type="text"
            {...register('cellphone')}
            placeholder="Celular del contacto"
            className={`input-box form-control ${
              errors.cellphone ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.cellphone?.message}</span>
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
