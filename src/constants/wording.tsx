import { IMenuOption } from '../components/GMenuOption';
import { IFeedback } from '../interfaces/IFeedback';
import { IHeadSectionTitle } from '../interfaces/IHeadSectionTitle';
import { ITextAction } from '../interfaces/ITextAction';

/**
 * Actions: A link that contains a description and a link to do an action.
 */

export const ForgetPasswordAction: ITextAction = {
  label: 'Olvidaste tu contraseña?',
  action: 'Recuperala!',
  route: '/forgot-password',
};

export const SignUpAction: ITextAction = {
  label: 'Eres nuevo?',
  action: 'Creá tu cuenta ahora!',
  route: '/sign-up',
};

export const SignInAction: ITextAction = {
  label: 'Ya eres parte del club?',
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

/**
 * Wording
 */

export const SuccessResetPasswordSubtitle: string =
  'Ahora podrás ingresar a tu cuenta con tu nueva contraseña!';

export const Okay: string = 'Okay!';

export const UserOptionsSubtitle: string = 'Opciones de usuario';

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
