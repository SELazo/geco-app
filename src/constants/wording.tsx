import { TextAction } from '../interfaces/textAction';

/**
 * Actions: A link that contains a description and a link to do an action.
 */

export const ForgetPasswordAction: TextAction = {
  label: 'Olvidaste tu contraseña?',
  action: 'Recuperala!',
};

export const SignInAction: TextAction = {
  label: 'Eres nuevo?',
  action: 'Creá tu cuenta ahora!',
};

export const SignUpAction: TextAction = {
  label: 'Ya eres parte del club?',
  action: 'Por aquí!',
};
