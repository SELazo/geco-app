import '../styles/gbutton.css';
import { FC } from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  label: string;
}

export const GSubmitButton: FC<SubmitButtonProps> = ({ onClick, label }) => {
  return (
    <button className="submit-btn" type="button" onClick={onClick}>
      {label}
    </button>
  );
};
