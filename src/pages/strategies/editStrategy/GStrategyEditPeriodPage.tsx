import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  EditStrategyPeriodTitle,
  StrategyDatesHelp,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setNewStrategyDates } from '../../../redux/sessionSlice';
import { IStrategyProps } from '../../../components/GStrategyCard';

export const GStrategyEditPeriodPage = () => {
  const today = new Date();
  const [isRangePicker, setIsRangePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(today);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  let strategyToEdit: IStrategyProps = location && location.state;

  useEffect(() => {
    if (!strategyToEdit) {
      navigate(`${ROUTES.STRATEGY.ROOT}`);
    }
  });

  const handleSwitchChange = () => {
    setIsRangePicker(!isRangePicker);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (isRangePicker) {
      if (selectedRange && selectedRange.from && selectedRange.to) {
        strategyToEdit = {
          ...strategyToEdit,
          start_date: selectedRange.from,
          end_date: selectedRange.to,
        };
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.PERIODICITY}`,
          { state: strategyToEdit }
        );
        return;
      }
      setValidationError(
        'Debés especificar una fecha de inicio y de fin si quieres utilizar un rango de fechas.'
      );
    } else {
      if (selectedDay) {
        strategyToEdit = {
          ...strategyToEdit,
          start_date: selectedDay,
          end_date: selectedDay,
        };
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.PERIODICITY}`,
          { state: strategyToEdit }
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
          title={EditStrategyPeriodTitle.title}
          subtitle={EditStrategyPeriodTitle.subtitle}
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
