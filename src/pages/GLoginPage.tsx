import { Component } from 'react';

import '../styles/gform.css';
import { GHeadCenterTitle } from '../components/GHeadCenterTitle';
import { GInputBox } from '../components/GInputBox';
import { GSubmitButton } from '../components/GSubmitButton';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GTextAction } from '../components/GTextAction';
import {
  SignUpAction,
  ForgetPasswordAction,
  LoginHeadCenterTitle,
} from '../constants/wording';
import { GLogoLetter } from '../components/GLogoLetter';

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

export class GLoginPage extends Component<LoginFormProps, LoginFormState> {
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

  render() {
    const { formData } = this.state;
    const iconButtonSignIn: IButtonIcon = {
      'icon-type': 'chevron-right',
      color: '#FFFFFF',
    };
    return (
      <form className="geco-form">
        <GLogoLetter />
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

        <GTextAction textAction={SignUpAction} />

        <GSubmitButton
          onClick={this.handleSubmit}
          label="Sign In"
          icon={iconButtonSignIn}
        />
        <GTextAction textAction={ForgetPasswordAction} />
      </form>
    );
  }
}
