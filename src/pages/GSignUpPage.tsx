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
  SignUpHeadSectionTitle,
} from '../constants/wording';
import { GLogoLetter } from '../components/GLogoLetter';
import { GHeadSectionTitle } from '../components/GHeadSectionTitle';
import { GCircularButton } from '../components/GCircularButton';
import { GIconButtonBack, GIconButtonSignIn } from '../constants/buttons';

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

export class GSignUpPage extends Component<LoginFormProps, LoginFormState> {
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

  onClickAction = () => {
    window.history.back();
  };

  handleSubmit = () => {
    const { formData } = this.state;
    console.log(formData);
  };

  render() {
    const { formData } = this.state;
    return (
      <>
        <div style={{ margin: '15px' }}>
          <GCircularButton
            icon={GIconButtonBack}
            onClickAction={this.onClickAction}
          />
          <GHeadSectionTitle
            title={SignUpHeadSectionTitle.title}
            subtitle={SignUpHeadSectionTitle.subtitle}
          />
        </div>
        <form className="geco-form">
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
            icon={GIconButtonSignIn}
          />
        </form>
      </>
    );
  }
}
