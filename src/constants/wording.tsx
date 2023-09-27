import { IDropdownHelpProps } from '../components/GDropdownHelp';
import { IMenuOption } from '../components/GMenuOption';
import { IFeedback } from '../interfaces/components/IFeedback';
import { IHeadSectionTitle } from '../interfaces/components/IHeadSectionTitle';
import { ITextAction } from '../interfaces/components/ITextAction';
import { ROUTES } from './routes';

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

export const LoginHeadCenterTitle: string = 'Inicio de sesión';

export const HomeHeadCenterTitle: string = 'Comienza a crecer';

export const AdHeadCenterTitle: string = 'Publicidades';

export const StrategyHeadCenterTitle: string = 'Estrategias de comunicación';

export const ContactsHeadCenterTitle: string = 'Agenda';

export const StatisticsHeadCenterTitle: string = 'Estadísticas';

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

export const NewGroupContactsEmpty: string =
  'No tienes contactos aún. Agregalos antes de continuar haciendo click aquí. 👍';

/**
 * Types Img
 */

export const AIImgType = { wording: 'Imagen inteligente.', code: 'ai' };
export const OwnImgType = { wording: 'Adjuntar archivo.', code: 'own' };
/**
 * Head Section Titles
 */

export const SignUpHeadSectionTitle: IHeadSectionTitle = {
  title: 'Crear cuenta',
  subtitle:
    'Completa los siguientes datos para comenzar a comunicar tus mensajes',
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

export const AddNewGroupStep1SectionTitle: IHeadSectionTitle = {
  title: 'Crear grupo',
  subtitle:
    'Crea un grupo de contactos para enviar comunicaciones.📢 \n Añade información sobre el mismo para poder identificarlo de forma rápida. 📋',
};

export const AddNewGroupStep2SectionTitle: IHeadSectionTitle = {
  title: 'Agrega contactos ',
  subtitle: 'Agrega los contactos que serán parte de tu nuevo grupo.👥',
};

export const AddContactsExcelSectionTitle: IHeadSectionTitle = {
  title: 'Importar contactos',
  subtitle: 'Importar contactos desde un archivo Excel. 🧐',
};

export const CreateAdSectionTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué tamaño tiene que tener tu publicidad?',
};

export const CreateAdPatternTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué disposición debe tener el texto en tu publicidad?',
};

export const CreateAdOwnImgTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué imagen vas a utilizar para tu publicidad?',
};

export const CreateAdGeneratedTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¡Aquí esta tu publicidad!',
};

export const CreateAdContentTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: 'Añade texto a tu publicidad.',
};

/**
 * Feedbacks
 */

export const PasswordChange: IFeedback = {
  title: 'Contraseña modificada!',
  subtitle: 'Ahora podes iniciar sesión con tu nueva contraseña',
  buttonLabel: 'Aceptar',
  buttonPath: '/login',
};

export const CommentSended: IFeedback = {
  title: 'Tu mensaje ha sido enviado!',
  subtitle: 'En breve nos estaremos comunicando con vos a través de un email',
  buttonLabel: 'Aceptar',
  buttonPath: '/home',
};

export const ContactAdded: IFeedback = {
  title: 'El contacto ha sido añadido!',
  subtitle: 'Ahora podes administrar tu nuevo contacto desde la Agenda',
  buttonLabel: 'Ver Agenda',
  buttonPath: '/contacts/list',
};

export const NewGroupAdded: IFeedback = {
  title: 'Grupo creado con éxito!',
  subtitle: 'Ahora podes administrar tu nuevo grupo desde la Agenda',
  buttonLabel: 'Mis Grupos',
  buttonPath: ROUTES.GROUPS.ROOT,
};

export const ContactsExcelAdded: IFeedback = {
  title: 'Los contactos han sido añadidos!',
  subtitle: 'Ahora podes administrar tus nuevos contactos desde la Agenda',
  buttonLabel: 'Ver Agenda',
  buttonPath: '/contacts/list',
};

export const UserEdited: IFeedback = {
  title: 'Perfil editado con éxito!',
  subtitle: 'Hemos actualizado tus datos con las modificaciones que realizaste',
  buttonLabel: 'Aceptar',
  buttonPath: '/user/info',
};

export const SignUpSuccessfull: IFeedback = {
  title: 'Cuenta creada con éxito!',
  subtitle: 'Ya podes comenzar a gestionar tus estrategias de comunicación',
  buttonLabel: 'Comenzar',
  buttonPath: '/login',
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

export const CreateAd: IMenuOption = {
  mainTitle: 'Crear publicidad',
  description: 'Aquí podrás crear nuevas publicidades',
  route: '/ad/create/size',
};

export const ListAds: IMenuOption = {
  mainTitle: 'Ver tus publicidad',
  description: 'Aquí podrás ver tus publicidades existentes',
  route: '/ad/list',
};

/**
 * Dropdown Help
 */

export const AdContentHelp: IDropdownHelpProps = {
  title: 'Ejemplo:',
  body: 'Mensaje principal: "El perfecto regalo para tu mamá"',
  body2: 'Texto adicional: "2 x 1 en las tortas más ricas!"',
};

export const AdOwnImgHelp: IDropdownHelpProps = {
  title: 'Recuerda:',
  body: 'La imagen elegida debe tener menos de 5MB y estar en formato JPG o PNG.',
};

export const ImportExcelHelp: IDropdownHelpProps = {
  title: 'Importante!',
  body: 'El Excel deberá estar compuesto por tres columnas: Nombres, números telefónicos y dirección de correos electrónicos.',
  routeLabel: 'Descarga una muestra!',
  route:
    'https://docs.google.com/spreadsheets/d/1vqt6EbxHXypIU73HsWhpmGDQkzeN4zLh/edit?usp=share_link&ouid=104991212361139592910&rtpof=true&sd=true',
};

/**
 * Form placeholders.
 */

export const NewGroupDescriptionPlaceholder: string =
  'Añade una descripción que te ayude a identificar el proposito del grupo de forma rápida. 👀';
