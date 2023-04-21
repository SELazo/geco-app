import React, { ChangeEvent, Component, FC, FormEvent } from 'react';
import { GInputBox } from './GInputBox';
import { GSubmitButton } from './GSubmitButton';
import { ButtonIcon } from '../interfaces/buttonIcon';

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

  render() {
    const { formData } = this.state;
    const iconButtonSignIn: ButtonIcon = {
      'icon-type': 'chevron-right',
      color: '#FFFFFF',
    };
    return (
      <form>
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
        <GSubmitButton
          onClick={this.handleSubmit}
          label="Sign In"
          icon={iconButtonSignIn}
        />
      </form>
    );
  }
}
