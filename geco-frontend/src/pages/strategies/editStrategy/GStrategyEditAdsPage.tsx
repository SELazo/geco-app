import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { INewGoupInfo } from '../../../redux/sessionSlice';

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
  CreateStrategyAdsTitle,
  NewStrategyAdsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { AdsService } from '../../../services/external/adsService';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { DateService } from '../../../services/internal/dateService';
import { IStrategyProps } from '../../../components/GStrategyCard';

const { getAds } = AdsService;
const { getDateString } = DateService;

export const GStrategyEditAdsPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
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
    const fetchAds = async () => {
      try {
        const adsData = await getAds();
        setAdsList(adsData.data ?? []);
        setSelectedNumbers(strategyToEdit.ads);
      } catch (error) {
        console.log(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchAds();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedNumbers.length === 0) {
      setError({
        show: true,
        message:
          'Selecciona al menos un publicidad para que sea parte de tu estrategia de comunicación.',
      });
    } else {
      strategyToEdit = { ...strategyToEdit, ads: selectedNumbers };
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.GROUPS}`,
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
          title={CreateStrategyAdsTitle.title}
          subtitle={CreateStrategyAdsTitle.subtitle}
        />
      </div>

      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        {adsList.length !== 0 ? (
          <div className="geco-input-group">
            {adsList.map((ad) => (
              <div key={ad.id}>
                <div className="geco-strategy-item-card">
                  <div className="geco-strategy-item-body">
                    <h1 className="geco-strategy-item-name">{ad.title}</h1>
                    <div className="geco-strategy-item-info">
                      <p>{getDateString(ad.create_date)}</p>
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`strategy-${ad.id}`}
                    checked={selectedNumbers.includes(ad.id)}
                    onChange={(e) => handleAdsSelection(e, ad.id)}
                  />
                </div>
              </div>
            ))}
            {error.show && <span className="span-error">{error.message}</span>}
          </div>
        ) : (
          <div className="geco-strategy-empty">
            <Link to={'/ad'}>
              <div className="geco-strategys-empty">
                <p>{NewStrategyAdsEmpty}</p>
              </div>
            </Link>
          </div>
        )}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
          disabled={adsList.length === 0}
        />
      </form>
    </div>
  );
};
