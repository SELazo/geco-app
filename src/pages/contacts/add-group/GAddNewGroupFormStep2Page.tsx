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
import {
  AddNewGroupStep2SectionTitle,
  NewGroupContactsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ContactsService } from '../../../services/external/contactsService';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';
import { GroupsService } from '../../../services/external/groupsService';
import { ROUTES } from '../../../constants/routes';

const { getContacts } = ContactsService;
const { newGroup } = GroupsService;

export const GAddNewGroupFormStep2Page = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [contactsList, setContactsList] = useState<IContactResponse[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groupInfo: INewGroupForm = useSelector(
    (state: any) => state.auth.formNewGroup
  );

  useEffect(() => {
    const previousPath = location.state?.from;

    if (
      previousPath === `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_SUCCESS}`
    ) {
      navigate(ROUTES.GROUPS.ROOT);
    }
  }, [location]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await getContacts();
        setContactsList(contactsData.data ?? []);
      } catch (error) {
        console.log(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchContacts();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    console.log('submit');
    if (selectedNumbers.length === 0) {
      setError({
        show: true,
        message: 'Selecciona al menos un contacto',
      });
    } else {
      dispatch(clearNewGroupForm());
      await newGroup(
        groupInfo.groupInfo.name,
        groupInfo.groupInfo.description,
        selectedNumbers
      )
        .then(() => {
          reset();
          navigate(`${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_SUCCESS}`);
        })
        .catch((e) => console.log(e)); //TODO: Mostrar error en pantalla
      reset();
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
            `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_INFO}`,
            { from: `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_MEMBERS}` }
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
        {contactsList.length !== 0 ? (
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
        ) : (
          <Link to={'/contacts/list'}>
            <div className="geco-contacts-empty">
              <p>{NewGroupContactsEmpty}</p>
            </div>
          </Link>
        )}

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
