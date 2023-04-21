import { Component } from 'react';

import '../styles/gform.css';
import { GHeadCenterTitle } from './GHeadCenterTitle';
import { GInputBox } from './GInputBox';
import { GSubmitButton } from './GSubmitButton';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GTextAction } from './GTextAction';
import {
  SignUpAction,
  ForgetPasswordAction,
  LoginHeadCenterTitle,
} from '../constants/wording';

interface LoginFormProps {
  //props
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormState {
  formData: LoginFormData;
}

export class GLoginForm extends Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = {
      formData: {
        email: '',
        password: '',
      },
    };
  }

  handleCHangeState = (name: string, value: string) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  handleEmailChange = (value: string) => {
    this.handleCHangeState('email', value);
  };

  handlePasswordChange = (value: string) => {
    this.handleCHangeState('password', value);
  };

  handleSubmit = () => {
    const { formData } = this.state;
    console.log(formData);
  };

  handlePasswordRecoveryRedirect = () => {
    console.log('Recovery password');
  };

  handleSignUpRedirect = () => {
    console.log('Sign up!');
  };

  render() {
    const { formData } = this.state;
    const iconButtonSignIn: IButtonIcon = {
      'icon-type': 'chevron-right',
      color: '#FFFFFF',
    };
    return (
      <form className="geco-form">
        <GHeadCenterTitle title={LoginHeadCenterTitle} />
        <GInputBox
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={this.handleEmailChange}
        />
        <GInputBox
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={this.handlePasswordChange}
        />

        <GTextAction
          onClick={this.handlePasswordRecoveryRedirect}
          textAction={SignUpAction}
        />

        <GSubmitButton
          onClick={this.handleSubmit}
          label="Sign In"
          icon={iconButtonSignIn}
        />
        <GTextAction
          onClick={this.handlePasswordRecoveryRedirect}
          textAction={ForgetPasswordAction}
        />
      </form>
    );
  }
}
