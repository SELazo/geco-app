import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdPallette } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdColoursTitle } from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdColours } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';
import { RootState } from '../../../redux/gecoStore';

const { getAdColours } = AdsService;

export const GAdColoursPage = () => {
  const [colours, setColours] = useState<IAdColours[]>([]);
  const formNewAd = useSelector((state: RootState) => state.auth.formNewAd);
  const [selectedHex, setSelectedHex] = useState<string>(GWhite);
  const [inputHex, setInputHex] = useState<string>(GWhite);
  const [hexValid, setHexValid] = useState<boolean>(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!formNewAd.template) {
      navigate(`${ROUTES.AD.ROOT}`);
    }
    const fetchColours = async () => {
      try {
        const response = await getAdColours();
        const coloursData = response as ApiResponse<IAdColours[]>;
        setColours(coloursData.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchColours();
  }, []);

  const handlePatternChange = (event: string) => {
    dispatch(setNewAdPallette(event));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.CONTENT}`
    );
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-add-contact-excel-nav-bar-section" to="/ad">
            <GCircularButton
              icon={GAdIcon}
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
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateAdColoursTitle.title}
          subtitle={CreateAdColoursTitle.subtitle}
        />
      </div>
      <form className="geco-form">
        <div className="geco-create-ad-container">
          {/* Color picker */}
          <p className="geco-strategy-subtitle">Elegí un color</p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            <input
              type="color"
              value={selectedHex}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedHex(val);
                setInputHex(val);
                setHexValid(true);
              }}
              style={{
                width: 48,
                height: 48,
                border: '2px solid #18191f',
                borderRadius: 8,
                padding: 0,
                background: '#fff',
              }}
            />
            <input
              type="text"
              placeholder="#RRGGBB"
              value={inputHex}
              onChange={(e) => {
                const val = e.target.value.trim();
                setInputHex(val);
                const ok = /^#([0-9A-Fa-f]{6})$/.test(val);
                setHexValid(ok);
                if (ok) setSelectedHex(val);
              }}
              className={`input-box form-control ${
                hexValid ? '' : 'is-invalid'
              }`}
              style={{
                maxWidth: 160,
                borderColor: hexValid ? undefined : '#ff4d4f',
              }}
            />
            <span style={{ color: '#9FA4B4', fontSize: 12 }}>
              Podés pegar un HEX (ej: #FFCC00)
            </span>
            <div
              style={{
                width: 60,
                height: 32,
                border: '2px solid #18191f',
                borderRadius: 8,
                background: selectedHex,
                boxShadow: '0 2px 0 #18191f',
              }}
            />
            <div>
              <button
                type="button"
                onClick={() => {
                  if (hexValid) handlePatternChange(selectedHex);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '2px solid #18191f',
                  boxShadow: '0 2px 0 #18191f',
                  background: '#FFD21E',
                  color: '#18191f',
                  fontWeight: 700,
                  cursor: hexValid ? 'pointer' : 'not-allowed',
                  opacity: hexValid ? 1 : 0.6,
                }}
              >
                Usar color
              </button>
            </div>

          </div>

          {/* Paletas personalizadas (existentes) */}
          {colours.length > 0 ? (
            <>
              <p className="geco-strategy-subtitle">Colores rápidos</p>
              <div className="geco-create-ad-list-img">
                {colours.map((item) => (
                  <div
                    key={`colour-${item.id.toString()}`}
                    style={{
                      width: '75px',
                      height: '150px',
                      marginBottom: '10px',
                      backgroundColor: item.hex,
                      cursor: 'pointer',
                    }}
                    onClick={() => handlePatternChange(item.hex)}
                  ></div>
                ))}
              </div>
            </>
          ) : (
            <p>No colours available.</p>
          )}
        </div>
      </form>
    </div>
  );
};
