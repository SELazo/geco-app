import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewGroupForm,
  clearNewGroupForm,
  setNewFormGroupInfo,
  setNewGroupContacts,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddgroup.css';
import('../../../styles/gcontactItem.css');

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GContactsIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { AddNewGroupStep2SectionTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { contactsService } from '../../../services/external/contactsService';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';

export const GAddNewGroupFormStep2Page = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [contactsList, setContactsList] = useState<IContactResponse[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const groupInfo: INewGroupForm = useSelector(
    (state: any) => state.auth.formNewGroup
  );

  useEffect(() => {
    const previousPath = location.state?.from;

    if (previousPath === '/contacts/groups/add-group/sucess') {
      navigate('/contacts/groups');
    }
  }, [location]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        //const contacts = await contactsService.getContacts();
        const contacts = [
          {
            id: 1,
            name: 'Julia',
            email: 'julia@email.com',
            phone: 123123123123,
          },
          {
            id: 2,
            name: 'Julia',
            email: 'julia@email.com',
            phone: 123123123123,
          },
        ];
        setContactsList(contacts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchContacts();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = () => {
    console.log('submit');
    if (selectedNumbers.length === 0) {
      setError({
        show: true,
        message: 'Selecciona al menos un contacto',
      });
      console.log(error);
    } else {
      console.log(groupInfo.groupInfo);
      console.log(selectedNumbers);
      dispatch(setNewFormGroupInfo(groupInfo.groupInfo));
      dispatch(setNewGroupContacts(selectedNumbers));
      reset();
      navigate('/contacts/groups');
    }
  };

  const handleContactSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const isChecked = e.target.checked;
    setSelectedNumbers((prevSelectedNumbers) => {
      if (isChecked) {
        return [...prevSelectedNumbers, id];
      } else {
        return prevSelectedNumbers.filter((number) => number !== id);
      }
    });
  };

  const { handleSubmit, reset } = useForm<INewGoupInfo>({
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
          onClickAction={NavigationService.handleNavigationWithState(
            '/contacts/groups/add-group/info',
            { from: '/contacts/groups/add-group/members' }
          )}
        />
      </div>
      <div className="geco-add-group-header-title">
        <GHeadSectionTitle
          title={AddNewGroupStep2SectionTitle.title}
          subtitle={AddNewGroupStep2SectionTitle.subtitle}
        />
      </div>
      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        <div className="geco-input-group">
          {contactsList.map((contact) => (
            <div key={contact.id}>
              <div className="geco-contact-item-card">
                <div className="geco-contact-body">
                  <h1 className="geco-contact-item-name">{contact.name}</h1>
                  <div className="geco-contact-item-info">
                    <p>{contact.phone}</p>
                    {contact.email && <p>{contact.email}</p>}
                  </div>
                </div>
                <input
                  className="geco-checkbox"
                  type="checkbox"
                  id={`contact-${contact.id}`}
                  checked={selectedNumbers.includes(contact.id)}
                  onChange={(e) => handleContactSelection(e, contact.id)}
                />
              </div>
            </div>
          ))}
          {error.show && <span className="span-error">{error.message}</span>}
        </div>
        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
          disabled={contactsList.length === 0}
        />
      </form>
    </div>
  );
};
