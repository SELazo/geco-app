import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import 'react-day-picker/dist/style.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';

import {
  CreateStrategyPeriodicityTitle,
  PeriodicitySubtitleSectionForm,
  ScheduleSubtitleSectionForm,
  StrategyConfigHelp,
} from '../../../constants/wording';
import { GBlack, GBlue, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useEffect, useState } from 'react';
import { FormControlLabel, Radio, RadioGroup, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  IPeriodicity,
  ISchedule,
  StrategyService,
} from '../../../services/internal/strategyService';
import { RootState } from '../../../redux/gecoStore';
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { setNewStrategyConfig } from '../../../redux/sessionSlice';

const { getPeriodicities, getSchedules } = StrategyService;

export const GStrategyPeriodicityPage = () => {
  const userStatus = useSelector((state: RootState) => state.auth.user.id);
  const [periodicities, setPeriodicities] = useState<IPeriodicity[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [selectedPeriodicity, setSelectedPeriodicity] = useState<
    string | undefined
  >();
  const [selectedSchedule, setSelectedSchedule] = useState<
    string | undefined
  >();
  const [isCustom, setIsCustom] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodicitiesData = getPeriodicities(userStatus);
        const schedulesData = getSchedules();
        if (
          periodicitiesData &&
          schedulesData &&
          periodicitiesData[0] &&
          schedulesData[0]
        ) {
          setPeriodicities(periodicitiesData);
          setSelectedPeriodicity(periodicitiesData[0].value);
          setSchedules(schedulesData);
          setSelectedSchedule(schedulesData[0].value);
        }
      } catch (error) {
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.ERROR}`
        );
      }
    };

    fetchData();
  }, []);

  const handleSwitchChange = () => {
    setIsCustom(!isCustom);
  };

  const handlePeriodicityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPeriodicity(event.target.value);
  };

  const handleScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSchedule(event.target.value);
  };

  const handleScheduleCustomChange = (event: Dayjs | any) => {
    if (event.$d && dayjs(event.$d).isValid()) {
      setSelectedSchedule(dayjs(event.$d).format('HH:mm'));
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (selectedSchedule && selectedPeriodicity) {
      dispatch(
        setNewStrategyConfig({
          periodicity: selectedPeriodicity,
          schedule: selectedSchedule,
        })
      );
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.RESUME}`
      );
    }
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link
            className="geco-add-contact-excel-nav-bar-section"
            to="/strategy"
          >
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
        <div className="geco-create-ad-nav-bar-right">
          <GDropdownHelp
            title={StrategyConfigHelp.title}
            body={StrategyConfigHelp.body}
            body2={StrategyConfigHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateStrategyPeriodicityTitle.title}
          subtitle={CreateStrategyPeriodicityTitle.subtitle}
        />
      </div>

      <form className="geco-form" onSubmit={handleSubmit}>
        <h3 className="geco-strategy-subtitle">
          {PeriodicitySubtitleSectionForm}
        </h3>
        <div className="geco-strategy-options-group">
          <RadioGroup>
            {periodicities.map((periodicity) => (
              <FormControlLabel
                key={`periodicity-${periodicity.id}`}
                control={
                  <Radio
                    checked={periodicity.value === selectedPeriodicity}
                    onChange={handlePeriodicityChange}
                    value={periodicity.value}
                    disabled={!periodicity.active}
                    sx={{
                      color: GBlue,
                      '&.Mui-checked': {
                        color: GBlue,
                      },
                      padding: '5px',
                    }}
                  />
                }
                label={
                  <span style={{ fontFamily: 'Montserrat' }}>
                    {periodicity.name}
                  </span>
                }
                labelPlacement="end"
              />
            ))}
          </RadioGroup>
        </div>
        <h3 className="geco-strategy-subtitle">
          {ScheduleSubtitleSectionForm}
        </h3>
        <FormControlLabel
          style={{ marginBottom: '10px' }}
          value="start"
          control={
            <Switch
              checked={isCustom}
              color="primary"
              onChange={handleSwitchChange}
              disabled={userStatus !== 1}
            />
          }
          label={
            <span style={{ fontFamily: 'Montserrat' }}>Personalizado</span>
          }
          labelPlacement="start"
        />
        {!isCustom ? (
          <div className="geco-strategy-options-group">
            <RadioGroup
              row={true}
              sx={{
                padding: '12px',
                '--RadioGroup-gap': '4px',
                '--Radio-actionRadius': '8px',
                justifyContent: 'center',
              }}
            >
              {schedules.map((schedule) => (
                <FormControlLabel
                  key={`schedule-${schedule.id}`}
                  control={
                    <Radio
                      checked={schedule.value === selectedSchedule}
                      onChange={handleScheduleChange}
                      value={schedule.value}
                      sx={{
                        color: GBlue,
                        '&.Mui-checked': {
                          color: GBlue,
                        },
                        padding: '5px',
                        display: 'none',
                      }}
                    />
                  }
                  label={
                    <span
                      style={{
                        padding: '12px',
                        marginLeft: '2px',
                        borderRadius: '12px',
                        fontFamily: 'Montserrat',
                        color:
                          schedule.value === selectedSchedule ? GWhite : '',
                        backgroundColor:
                          schedule.value === selectedSchedule ? GBlue : '',
                      }}
                    >
                      {schedule.name}
                    </span>
                  }
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
            <br />
          </div>
        ) : (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker', 'TimePicker']}>
                <TimeField
                  label="Ingresa un horario..."
                  format="HH:mm"
                  onChange={handleScheduleCustomChange}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Montserrat',
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <br />
          </>
        )}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
