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

export const HomeHeadCenterTitle: string = 'Comenzá a crecer';

export const AdHeadCenterTitle: string = 'Publicidades';

export const StrategyHeadCenterTitle: string = 'Difusión';

export const ContactsHeadCenterTitle: string = 'Agenda';

export const StatisticsHeadCenterTitle: string = 'Estadísticas';

export const ResponsesHeadCenterTitle: string = 'Respuestas';

export const EditUserInfoTitle: string = 'Editar información';

export const PricingTitle: string = 'Cambiar suscripción';

export const CommentsTitle: string = 'Contáctanos';

export const PricingSectionTitle: string = 'Modalidades';

export const ContactsSectionTitle: string = 'Agenda';

export const StatisticsSectionTitle: string = 'Estadísticas';

export const ResponsesSectionTitle: string = 'Respuestas';

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

export const NewStrategyAdsEmpty: string =
  'No tienes publicidades aún. Pero no te preocupes, crea tus propias publicidades antes de continuar haciendo click aquí. 👍';

export const NewStrategyGroupsEmpty: string =
  'No tienes grupos de contactos aún. Pero no te preocupes, crea agrupa tus contactos para poder enviar tus comunicaciones antes de continuar haciendo click aquí. 👍';

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
  subtitle: '¿Qué tamaño tiene que tener tu publicidad? 📏',
};

export const CreateAdPatternTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué disposición debe tener el texto en tu publicidad? ✍',
};

export const CreateAdColoursTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué colores quieres que tenga el texto de tu publicidad? 🎨',
};

export const CreateAdOwnImgTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¿Qué imagen vas a utilizar para tu publicidad? 🖼',
};

export const CreateAdGeneratedTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: '¡Aquí esta tu publicidad! 🎊',
};

export const CreateAdContentTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle: 'Añade texto a tu publicidad. ✍',
};

export const CreateAdIdentificationTitle: IHeadSectionTitle = {
  title: 'Crear publicidad',
  subtitle:
    'Ingresa la información para identificar tu publicidad. Esto te ayudará a encontrarla para asociarla a tus estrategias de comunicación! 📄',
};

export const EditAdIdentificationTitle: IHeadSectionTitle = {
  title: 'Editar publicidad',
  subtitle:
    'Ingresa la información para identificar tu publicidad. Esto te ayudará a encontrarla para asociarla a tus estrategias de comunicación! 📄',
};

export const CreateStrategyInformationTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle:
    '¡Empecemos! ¿Que oportunidad tiene tu nueva estrategia de comunicación? 💡',
};

export const CreateStrategyAdsTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle:
    'Agrega las publicidades que quieras difundir durante la duración de esta estrategia de comunicación! 📡',
};

export const CreateStrategyGroupsTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle:
    'Agrega los grupos a los cuales esta dirigida esta estrategia de comunicación! 👥',
};

export const CreateStrategyResumeTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle: 'Estamos listos! 🚀',
};

export const CreateStrategyPeriodTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle:
    'Elige las fechas en las cuales tu estrategia de comunicación será difundida. Recuerda que puedes elegir un día o un rango de días. 📅',
};

export const CreateStrategyPeriodicityTitle: IHeadSectionTitle = {
  title: 'Crear estrategia de comunicación',
  subtitle:
    '¿Cómo preferís que se realice la difución de tu estrategia de comunicación? ⏰',
};

export const EditStrategyInformationTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle:
    '¡Empecemos! ¿Que oportunidad tiene tu nueva estrategia de comunicación? 💡',
};

export const EditStrategyAdsTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle:
    'Agrega las publicidades que quieras difundir durante la duración de esta estrategia de comunicación! 📡',
};

export const EditStrategyGroupsTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle:
    'Agrega los grupos a los cuales esta dirigida esta estrategia de comunicación! 👥',
};

export const EditStrategyResumeTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle: 'Estamos listos! 🚀',
};

export const EditStrategyPeriodTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle:
    'Elige las fechas en las cuales tu estrategia de comunicación será difundida. Recuerda que puedes elegir un día o un rango de días. 📅',
};

export const EditStrategyPeriodicityTitle: IHeadSectionTitle = {
  title: 'Editar estrategia de comunicación',
  subtitle:
    '¿Cómo preferís que se realice la difución de tu estrategia de comunicación? ⏰',
};

export const ResponsesListTitle: IHeadSectionTitle = {
  title: 'Respuestas de formularios',
  subtitle: 'Consulta las respuestas que han enviado tus contactos a través de los formularios de tus estrategias de comunicación 📋',
};

export const ResponsesViewTitle: IHeadSectionTitle = {
  title: 'Respuestas de la estrategia',
  subtitle: 'Aquí puedes ver todas las respuestas recibidas para esta estrategia 📊',
};

/**
 * Subtitles for sections
 */

export const PeriodicitySubtitleSectionForm =
  '¿Cuántas veces quieres que se envie tu estrategia durante el periodo de tiempo que elegiste?';

export const ScheduleSubtitleSectionForm =
  '¿En qué momento del día preferís que se hagan las difusiones?';

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
  buttonPath: '/user/info',
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

export const PostAdSuccessfull: IFeedback = {
  title: 'Publicidad creada',
  subtitle:
    'Podrás visualizarla en Publicidades y utilizarla para una de tus Estrategias de comunicación',
  buttonLabel: 'Okay',
  buttonPath: '/ad/list',
};

export const PostEditAdSuccessfull: IFeedback = {
  title: 'Publicidad editada con éxito!',
  subtitle:
    'Podrás visualizala en Publicidades o elegirla para una de tus Estrategias de comunicación!',
  buttonLabel: 'Okey',
  buttonPath: '/ad/list',
};

export const PostStrategySuccessfull: IFeedback = {
  title: 'Estrategia de comunicación creada! 🙌✨',
  subtitle: 'Podrás visualizala en Estrategias de comunicación!',
  buttonLabel: 'Okey',
  buttonPath: '/strategy',
};

export const PostStrategyEditSuccessfull: IFeedback = {
  title: 'Estrategia de comunicación editada! 🙌✨',
  subtitle: 'Podrás visualizala en Estrategias de comunicación!',
  buttonLabel: 'Okey',
  buttonPath: '/strategy',
};

export const AdError: IFeedback = {
  title: 'Hubo un error!',
  subtitle: 'Sucedio algo inesperado 😥. Intenta de nuevo más tarde.',
  buttonLabel: 'Okey',
  buttonPath: '/ad',
};

export const StrategyError: IFeedback = {
  title: 'Hubo un error!',
  subtitle: 'Sucedio algo inesperado 😥. Intenta de nuevo más tarde.',
  buttonLabel: 'Okey',
  buttonPath: '/strategy',
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

export const CreateStrategy: IMenuOption = {
  mainTitle: 'Crear estrategia',
  description: 'Aquí podrás crear nuevas estrategias de comunicación',
  route: '/strategy/create/information',
};

export const ListStrategies: IMenuOption = {
  mainTitle: 'Ver tus estrategias',
  description: 'Aquí podrás ver tus estrategias de comunicación existentes',
  route: '/strategy/list',
};

/**
 * Dropdown Help
 */

export const AdContentHelp: IDropdownHelpProps = {
  title: 'Ejemplo:',
  body: 'Mensaje principal: "El perfecto regalo para tu mamá"',
  body2: 'Texto adicional: "2 x 1 en las tortas más ricas!"',
};

export const AdIdentificationHelp: IDropdownHelpProps = {
  title: 'Ejemplo:',
  body: 'Mensaje principal: "Tortas 2 x 1 para día de la madre"',
  body2:
    'Texto que se adjuntará a tu mensaje difundido: "Las tortas incluidas en la promo son la Torta Selva Negra (Torta de chocolate ) y la de Frutillas (Torta de crama con frutillas. Mensajeanos por cualquier duda que tengas!"',
};

export const StrategyInformationHelp: IDropdownHelpProps = {
  title: 'Ejemplos:',
  body: '"Día de la madre 2023"',
  body2: '"Promociones de fin de semana"',
};

export const StrategyDatesHelp: IDropdownHelpProps = {
  title: 'Sobre fechas:',
  body: 'Podrás elegir un día o un rango de fechas. Si eliges un rango, se enviarán las comunicaciones de la estrategia todos los días del rango de fechas.',
};

export const StrategyConfigHelp: IDropdownHelpProps = {
  title: 'Recuerda que:',
  body: 'Podrás elegir más opciones accediendo a la modalidad premium! 🤯',
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
