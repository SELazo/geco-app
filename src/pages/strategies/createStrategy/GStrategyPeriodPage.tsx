import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';

import {
  CreateStrategyPeriodTitle,
  StrategyDatesHelp,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useState, useEffect } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setNewStrategyDates, INewStrategyForm } from '../../../redux/sessionSlice';
import { RootState } from '../../../redux/gecoStore';

export const GStrategyPeriodPage = () => {
  const today = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Leer valores previos de Redux
  const strategyForm: INewStrategyForm = useSelector(
    (state: RootState) => state.formNewStrategy
  );
  
  // Determinar si es rango basado en fechas previas
  const hasRange = strategyForm?.startDate && strategyForm?.endDate && 
    new Date(strategyForm.startDate).getTime() !== new Date(strategyForm.endDate).getTime();
  
  // Precargar estados
  const [isRangePicker, setIsRangePicker] = useState(hasRange || false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    strategyForm?.startDate && !hasRange ? new Date(strategyForm.startDate) : today
  );
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    hasRange ? {
      from: new Date(strategyForm.startDate!),
      to: new Date(strategyForm.endDate!),
    } : undefined
  );
  const [validationError, setValidationError] = useState('');

  const handleSwitchChange = () => {
    setIsRangePicker(!isRangePicker);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (isRangePicker) {
      if (selectedRange && selectedRange.from && selectedRange.to) {
        dispatch(
          setNewStrategyDates({
            start: selectedRange.from.toISOString(),
            end: selectedRange.to.toISOString(),
          })
        );
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.PERIODICITY}`
        );
        return;
      }
      setValidationError(
        'Debés especificar una fecha de inicio y de fin si quieres utilizar un rango de fechas.'
      );
    } else {
      if (selectedDay) {
        dispatch(
          setNewStrategyDates({
            start: selectedDay.toISOString(),
            end: selectedDay.toISOString(),
          })
        );
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.PERIODICITY}`
        );
      }
      return;
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
            title={StrategyDatesHelp.title}
            body={StrategyDatesHelp.body}
            body2={StrategyDatesHelp.body2}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateStrategyPeriodTitle.title}
          subtitle={CreateStrategyPeriodTitle.subtitle}
        />
      </div>

      <form className="geco-form" onSubmit={handleSubmit}>
        <FormControlLabel
          value="start"
          control={
            <Switch
              checked={isRangePicker}
              color="primary"
              onChange={handleSwitchChange}
            />
          }
          label={
            <span style={{ fontFamily: 'Montserrat' }}>Rango de fechas</span>
          }
          labelPlacement="start"
        />
        {!isRangePicker ? (
          <DayPicker
            mode="single"
            required
            selected={selectedDay}
            onSelect={setSelectedDay}
            locale={es}
            disabled={{ before: today }}
          />
        ) : (
          <>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={setSelectedRange}
              locale={es}
              disabled={{ before: today }}
            />
            {validationError && (
              <span className="span-error">{validationError}</span>
            )}
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
