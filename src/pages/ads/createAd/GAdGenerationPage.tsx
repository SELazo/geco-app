import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdGeneratedTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../../constants/routes';
import { RootState } from '../../../redux/gecoStore';
import { AdGenerationService } from '../../../services/internal/adGenerationService';
import { useEffect, useState } from 'react';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { PacmanLoader } from 'react-spinners';

export const GAdGenerationPage = () => {
  const [generatedAd, setGeneratedAd] = useState<string>();
  const [loading, setLoading] = useState(false);
  const formNewAd = useSelector((state: RootState) => state.auth.formNewAd);

  const location = useLocation();
  const navigate = useNavigate();

  const img = location && location.state;

  useEffect(() => {
    const generateAd = async () => {
      try {
        setLoading(true);
        const base64Ad = await AdGenerationService.generation({
          titleAd: formNewAd.titleAd ?? undefined,
          textAd: formNewAd.textAd ?? undefined,
          pallette: formNewAd.pallette,
          template: formNewAd.template,
          img: img,
        });

        setGeneratedAd(base64Ad);
      } catch (error) {
        navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}`);
      } finally {
        setLoading(false);
      }
    };
    generateAd();
  }, [formNewAd, img]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.INFORMATION}`,
      { state: generatedAd }
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
          title={CreateAdGeneratedTitle.title}
          subtitle={CreateAdGeneratedTitle.subtitle}
        />
        <form className="geco-form" onSubmit={handleSubmit}>
          {loading ? (
            <div
              style={{
                textAlign: 'start',
                marginTop: '25vh',
              }}
            >
              <PacmanLoader color={GYellow} />
            </div>
          ) : (
            <>
              {generatedAd && (
                <>
                  <img
                    style={{ width: '100%' }}
                    src={generatedAd}
                    alt="Imagen desde Base64"
                  />
                  <GSubmitButton
                    label="Siguiente"
                    colorBackground={GYellow}
                    colorFont={GBlack}
                  />
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};
