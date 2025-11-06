import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gadimage.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GDeletetIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';

const { getAdImg } = AdsService;

export const GAdViewPage = () => {
  const [loading, setLoading] = useState(false);
  const [adFile, setAdFile] = useState<string | null>(null);
  const [errorImg, setErrorImg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const ad: IGetAdResponse = location && location.state;

  useEffect(() => {
    console.log('📸 Cargando vista previa de publicidad...');
    console.log('📸 Datos completos de publicidad:', ad);

    if (!ad || !ad.id || !ad.description || !ad.title) {
      console.error('❌ Datos de publicidad incompletos');
      navigate(`${ROUTES.AD.ROOT}`);
      return;
    }

    // 🔍 BUSCAR IMAGEN EN MÚLTIPLES UBICACIONES
    let foundImage = false;

    // Opción 1: imageUrl en el objeto principal
    if (ad.imageUrl) {
      console.log(
        '✅ Imagen encontrada en ad.imageUrl (longitud):',
        ad.imageUrl.length
      );
      setAdFile(ad.imageUrl);
      foundImage = true;
    }
    // Opción 2: ad_image en firestoreData
    else if ((ad as any).firestoreData?.ad_image) {
      console.log(
        '✅ Imagen encontrada en firestoreData.ad_image (longitud):',
        (ad as any).firestoreData.ad_image.length
      );
      setAdFile((ad as any).firestoreData.ad_image);
      foundImage = true;
    }
    // Opción 3: content.imageUrl en firestoreData
    else if ((ad as any).firestoreData?.content?.imageUrl) {
      console.log(
        '✅ Imagen encontrada en firestoreData.content.imageUrl (longitud):',
        (ad as any).firestoreData.content.imageUrl.length
      );
      setAdFile((ad as any).firestoreData.content.imageUrl);
      foundImage = true;
    }
    // Opción 4: imageUrl directo en firestoreData
    else if ((ad as any).firestoreData?.imageUrl) {
      console.log(
        '✅ Imagen encontrada en firestoreData.imageUrl (longitud):',
        (ad as any).firestoreData.imageUrl.length
      );
      setAdFile((ad as any).firestoreData.imageUrl);
      foundImage = true;
    }

    if (!foundImage) {
      console.error('❌ No se encontró imagen en ninguna ubicación');
      console.error('❌ Estructura del objeto:', {
        hasImageUrl: !!ad.imageUrl,
        hasFirestoreData: !!(ad as any).firestoreData,
        firestoreDataKeys: (ad as any).firestoreData
          ? Object.keys((ad as any).firestoreData)
          : [],
        hasAdImage: !!(ad as any).firestoreData?.ad_image,
        hasContentImageUrl: !!(ad as any).firestoreData?.content?.imageUrl,
      });
      setErrorImg(
        'No se pudo cargar la imagen 😥 - La publicidad puede tener un formato antiguo'
      );
    }

    setLoading(false);
  }, []);

  const handleEditAction = () => {
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.EDIT.ROOT}${ROUTES.AD.EDIT.INFORMATION}`,
      {
        state: ad,
      }
    );
  };

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link className="geco-contacts-list-nav-bar-section" to="/ad">
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
          <div className="geco-contacts-list-head-nav-bar-right">
            <GCircularButton
              icon={GEditIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
              onClickAction={handleEditAction}
            />
          </div>
        </div>
        <div className="geco-ad-header-title">
          <GHeadSectionTitle title={ad.title} subtitle={ad.description} />
        </div>

        {adFile && (
          <div className="file-preview-ad-view">
            <img src={adFile} alt="Vista previa" />
          </div>
        )}
      </div>
    </>
  );
};
