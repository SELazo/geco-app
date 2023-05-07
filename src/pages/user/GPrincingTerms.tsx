import('../../styles/gpricingterms.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { useSelector } from 'react-redux';

interface Terms {
  id: number;
  title: string;
}

export const GPricingTermsPage = () => {
  const idTerms = useSelector((state: any) => state.auth.terms);
  const termsOptions: Terms[] = [
    {
      id: 1,
      title: 'Cuenta FREE',
    },
    {
      id: 2,
      title: 'Cuenta PREMIUM',
    },
  ];

  const terms = `Términos y Condiciones de uso

Bienvenido a nuestro servicio de administración de publicidades. Estos son los términos y condiciones de uso que regulan la relación entre nosotros, la empresa prestadora del servicio, y usted, el usuario que utiliza nuestro servicio.

1. Servicio
Nuestro servicio consiste en permitir a los usuarios la administración de sus publicidades en distintas plataformas digitales. Nosotros proveemos las herramientas necesarias para la gestión de las campañas publicitarias y el seguimiento de su rendimiento.

2. Responsabilidades
Es responsabilidad del usuario asegurarse de que el contenido de sus publicidades cumpla con las normas legales y éticas aplicables. Nosotros no nos hacemos responsables del contenido de las publicidades de los usuarios. 

3. Propiedad intelectual
Todo el contenido de nuestro servicio, incluyendo pero no limitado a la plataforma, los diseños, el software, los gráficos, las imágenes, las fotografías, los videos, las animaciones, los textos y los logos, son propiedad de la empresa prestadora del servicio y están protegidos por las leyes de propiedad intelectual aplicables. Los usuarios no tienen derecho a utilizar el contenido de nuestro servicio sin nuestra autorización previa y expresa.

4. Modificaciones
Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento y sin previo aviso. Los usuarios serán notificados de cualquier cambio mediante una notificación en la plataforma. El uso continuo del servicio luego de la publicación de los cambios implica la aceptación de los nuevos términos y condiciones.

5. Terminación
Nos reservamos el derecho de terminar la cuenta de cualquier usuario que viole estos términos y condiciones. Los usuarios pueden cancelar su cuenta en cualquier momento.

6. Limitación de responsabilidad
En ningún caso seremos responsables por los daños y perjuicios directos, indirectos, especiales, fortuitos o consecuentes derivados del uso del servicio, incluyendo pero no limitado a la pérdida de datos, la interrupción del servicio, la pérdida de negocios o cualquier otra pérdida financiera.

7. Ley aplicable y jurisdicción
Estos términos y condiciones se regirán e interpretarán de acuerdo a las leyes de [país]. Cualquier disputa relacionada con este contrato será resuelta por los tribunales de la ciudad de [ciudad].

Al utilizar nuestro servicio, usted acepta estos términos y condiciones. Si no está de acuerdo con estos términos y condiciones, por favor absténgase de utilizar nuestro servicio.`;

  const getTerms = () => {
    return termsOptions.find((term) => term.id === idTerms);
  };
  return (
    <div className="geco-pricing-terms-main">
      <div className="geco-pricing-terms-header">
        <GCircularButton
          icon={GIconButtonBack}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.goBack}
        />
        <div className="geco-pricing-terms-title">
          <GHeadCenterTitle title="Términos y condiciones" color={GBlack} />
        </div>
      </div>
      <div className="geco-pricing-terms-info">
        <h1>{getTerms()?.title}</h1>
        <div className="geco-pricing-terms-body">{terms}</div>
      </div>
    </div>
  );
};
