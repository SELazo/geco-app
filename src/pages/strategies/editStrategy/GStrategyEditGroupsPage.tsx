import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  INewGoupInfo,
  setNewStrategyGroups,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GIconButtonBack,
  GStrategyIcon,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  EditStrategyGroupsTitle,
  NewStrategyGroupsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { GroupsService } from '../../../services/external/groupsService';
import { IGroup } from '../../../interfaces/dtos/external/IGroups';
import { IStrategyProps } from '../../../components/GStrategyCard';

const { getGroups } = GroupsService;

export const GStrategyEditGroupsPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const location = useLocation();

  let strategyToEdit: IStrategyProps = location && location.state;

  useEffect(() => {
    if (!strategyToEdit) {
      navigate(`${ROUTES.STRATEGY.ROOT}`);
    }
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await getGroups();
        setGroupsList(groupsData ?? []);
        setSelectedNumbers(strategyToEdit.groups);
      } catch (error) {
        console.log(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchGroups();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedNumbers.length === 0) {
      setError({
        show: true,
        message:
          'Selecciona al menos un grupo para que reciba las comunicaciones de tu estrategia.',
      });
    } else {
      strategyToEdit = { ...strategyToEdit, groups: selectedNumbers };
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.PERIOD}`,
        { state: strategyToEdit }
      );
      reset();
    }
  };

  const handleAdsSelection = (
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

  const { handleSubmit, reset } = useForm<INewGoupInfo | {}>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-strategy-main">
      <div className="geco-strategy-nav-bar">
        <Link className="geco-strategy-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-strategy-nav-bar-section" to="/strategy">
          <GCircularButton
            icon={GStrategyIcon}
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
      <div className="geco-strategy-header-title">
        <GHeadSectionTitle
          title={EditStrategyGroupsTitle.title}
          subtitle={EditStrategyGroupsTitle.subtitle}
        />
      </div>

      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        {groupsList.length !== 0 ? (
          <div className="geco-input-group">
            {groupsList.map((group) => (
              <div key={group.id}>
                <div className="geco-strategy-item-card">
                  <div className="geco-strategy-item-body">
                    <h1 className="geco-strategy-item-name">{group.name}</h1>
                    <div className="geco-strategy-item-info">
                      <p>{group.description}</p>
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`strategy-${group.id}`}
                    checked={selectedNumbers.includes(group.id)}
                    onChange={(e) => handleAdsSelection(e, group.id)}
                  />
                </div>
              </div>
            ))}
            {error.show && <span className="span-error">{error.message}</span>}
          </div>
        ) : (
          <div className="geco-strategy-empty">
            <Link to={'/contacts/groups'}>
              <div className="geco-strategys-empty">
                <p>{NewStrategyGroupsEmpty}</p>
              </div>
            </Link>
          </div>
        )}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
          disabled={groupsList.length === 0}
        />
      </form>
    </div>
  );
};
