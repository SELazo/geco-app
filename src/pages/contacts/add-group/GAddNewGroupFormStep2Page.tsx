import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewGroupForm,
  clearNewGroupForm,
  setNewFormGroupInfo,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddgroup.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GContactsIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  AddNewGroupStep1SectionTitle,
  NewGroupDescriptionPlaceholder,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/navigationService/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';

export const GAddNewGroupFormStep2Page = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let hasGroupInfo: INewGroupForm = {} as INewGroupForm;

  useEffect(() => {
    const previousPath = location.state?.from;

    if (previousPath === '/contacts/groups/add-group/members') {
      hasGroupInfo = useSelector((state: any) => state.auth.formNewGroup);
    } else {
      dispatch(clearNewGroupForm());
    }
  }, [location]);

  const validationSchema = Yup.object().shape({
    numbers: Yup.array().min(1, 'Selecciona al menos un contacto'),
  });

  const onSubmit = (data: INewGoupInfo) => {
    console.log(data);
    dispatch(setNewFormGroupInfo(data));
    reset();
    navigate('/contacts/groups/add-group/members');
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INewGoupInfo>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-add-group-main">
      <div className="geco-add-group-nav-bar">
        <Link className="geco-add-group-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-add-group-nav-bar-section" to="/contacts/info">
          <GCircularButton
            icon={GContactsIcon}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
          />
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
      <div className="geco-add-group-header-title">
        <GHeadSectionTitle
          title={AddNewGroupStep1SectionTitle.title}
          subtitle={AddNewGroupStep1SectionTitle.subtitle}
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="checkbox"
            {...register('name')}
            placeholder="Nombre del grupo"
            defaultValue={
              hasGroupInfo.groupInfo?.name ? hasGroupInfo.groupInfo.name : ''
            }
            className={`input-box form-control ${
              errors.name ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.name?.message}</span>
        </div>
        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
        />
      </form>
    </div>
  );
};
