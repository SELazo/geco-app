import '../styles/ginputBox.css';
import { ChangeEvent, Component, useState } from 'react';

interface InputBoxProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface InputBoxState {
  value: string;
}

export class GInputBox extends Component<InputBoxProps, InputBoxState> {
  constructor(props: InputBoxProps) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: event.target.value,
    });

    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <input
        className="input-box"
        type={this.props.type}
        value={this.state.value}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
      />
    );
  }
}
