import { IDropdownHelpProps } from '../components/GDropdownHelp';
import { IMenuOption } from '../components/GMenuOption';
import { IFeedback } from '../interfaces/IFeedback';
import { IHeadSectionTitle } from '../interfaces/IHeadSectionTitle';
import { ITextAction } from '../interfaces/ITextAction';

/**
 * Actions: A link that contains a description and a link to do an action.
 */

export const ForgetPasswordAction: ITextAction = {
  label: 'Olvidaste tu contraseña? ',
  action: 'Recuperala!',
  route: '/forgot-password',
};

export const SignUpAction: ITextAction = {
  label: 'Eres nuevo? ',
  action: 'Creá tu cuenta ahora!',
  route: '/sign-up',
};

export const SignInAction: ITextAction = {
  label: 'Ya eres parte del club? ',
  action: 'Por aquí!',
  route: '/login',
};

/**
 * Head Center Titles
 */

export const LoginHeadCenterTitle: string = 'Login';

export const HomeHeadCenterTitle: string = 'Comienza a crecer';

export const AdHeadCenterTitle: string = 'Publicidades';

export const StrategyHeadCenterTitle: string = 'Estrategias de comunicación';

export const ContactsHeadCenterTitle: string = 'Agenda';

export const StatisticsHeadCenterTitle: string = 'Estadísticas';

export const SuccessResetPasswordTitle: string = 'Contraseña modificada!';

export const EditUserInfoTitle: string = 'Editar información';

export const PricingTitle: string = 'Cambiar suscripción';

export const CommentsTitle: string = 'Contáctanos';

export const PricingSectionTitle: string = 'Modalidades';

export const ContactsSectionTitle: string = 'Agenda';

export const StatisticsSectionTitle: string = 'Estadísticas';

export const GroupGrowthSectionTitle: string =
  'Crecimiento de los grupos en tu red';

export const RedCompositionSectionTitle: string =
  'Composición de tu red de contactos';

/**
 * Wording
 */

export const SuccessResetPasswordSubtitle: string =
  'Ahora podrás ingresar a tu cuenta con tu nueva contraseña!';

export const Okay: string = 'Okay!';

export const UserOptionsSubtitle: string = 'Opciones de usuario';

export const UserEditInfoSubtitle: string = 'Edita tu información';

export const Months: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Head Section Titles
 */

export const SignUpHeadSectionTitle: IHeadSectionTitle = {
  title: 'Sign Up',
  subtitle: 'Crea tu cuenta para comenzar a comunicar tus mensajes!',
};

export const ForgotPasswordHeadSectionTitle: IHeadSectionTitle = {
  title: 'Recupera tu contraseña',
  subtitle:
    'Ingresa el email correspondiente a tu cuenta. Te llegará un mail para poder recuperarla!',
};

export const ResetPasswordHeadSectionTitle: IHeadSectionTitle = {
  title: 'Nueva contraseña',
  subtitle: 'Ingresa tu nueva contraseña y confirmala.',
};

export const CommentsHeadSectionTitle: IHeadSectionTitle = {
  title: 'Contactános',
  subtitle: 'Si tienés alguna duda no dudes en mensajearnos 😃',
};

export const AddContactSectionTitle: IHeadSectionTitle = {
  title: 'Crear contacto',
  subtitle: 'Crea un nuevo contacto. 😌',
};

export const AddContactsExcelSectionTitle: IHeadSectionTitle = {
  title: 'Importar contactos',
  subtitle: 'Importar contactos desde un archivo Excel. 🧐',
};

/**
 * Feedbacks
 */

export const PasswordChange: IFeedback = {
  title: 'Contraseña modificada!',
  subtitle: 'Ahora podrás ingresar a tu cuenta con tu nueva contraseña!',
  buttonLabel: 'Okay!',
  buttonPath: '/login',
};

export const CommentSended: IFeedback = {
  title: 'Tu mensaje ha sido enviado!',
  subtitle:
    'En breve nos pondremos estaremos comunicando a través de un email!',
  buttonLabel: 'Okay!',
  buttonPath: '/home',
};

export const ContactAdded: IFeedback = {
  title: 'El contacto ha sido añadido!',
  subtitle: 'Ahora podrá administrar su nuevo contacto a través de la Agenda!',
  buttonLabel: 'Okay!',
  buttonPath: '/contacts/list',
};

export const ContactsExcelAdded: IFeedback = {
  title: 'Los contactos han sido añadidos!',
  subtitle:
    'Ahora podrá administrar sus nuevo contactos a través de la Agenda!',
  buttonLabel: 'Okay!',
  buttonPath: '/contacts/list',
};

/**
 * Menu Options
 */

export const AdminListContacts: IMenuOption = {
  mainTitle: 'Administrar contactos',
  description: 'Agrega, modifica o elimina tus contactos',
  route: '/contacts/list',
};

export const GroupsContacts: IMenuOption = {
  mainTitle: 'Administrar grupos',
  description: 'Agrega, modifica o elimina tus grupos',
  route: '/contacts/groups',
};

export const FeedbackStrategiesStatistics: IMenuOption = {
  mainTitle: 'Feedback de estrategias de comunicación',
  description: 'Consulta como le fue a tus estrategias de comunicación',
  route: '/statistics/strategies',
};

export const FeedbackContactsStatistics: IMenuOption = {
  mainTitle: 'Feedback de red de contactos',
  description: 'Consulta como creció tu red de contactos',
  route: '/statistics/contacts',
};

/**
 * Dropdown Help
 */

export const ImportExcelHelp: IDropdownHelpProps = {
  title: 'Importante!',
  body: 'El Excel deberá estar compuesto por tres columnas: Nombres, números telefónicos y dirección de correos electrónicos.',
  routeLabel: 'Descarga una muestra!',
  route:
    'https://docs.google.com/spreadsheets/d/1vqt6EbxHXypIU73HsWhpmGDQkzeN4zLh/edit?usp=share_link&ouid=104991212361139592910&rtpof=true&sd=true',
};
