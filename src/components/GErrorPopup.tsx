import React, { useState } from 'react';

import '../styles/gerrorpopup.css';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { GIcon } from './GIcon';

interface PopupProps {
  onClose: () => void;
  children?: React.ReactNode;
}

const GPopup: React.FC<PopupProps> = ({ onClose, children }) => {
  return (
    <div className="geco-error-pop-up-overlay" onClick={onClose}>
      <div className="geco-error-pop-up" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

interface ErrorPopupProps {
  icon: IButtonIcon;
  label: string;
  onRequestError: () => void;
}

export const GErrorPopup: React.FC<ErrorPopupProps> = (
  props: ErrorPopupProps
) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleClose = () => {
    setShowPopup(false);
    props.onRequestError();
  };

  return (
    <>
      {showPopup && (
        <GPopup onClose={handleClose}>
          <div className="geco-error-pop-up-body">
            <div className="geco-error-pop-up-icon">
              <GIcon
                icon-type={props.icon['icon-type']}
                color={props.icon.color}
              />
            </div>
            <p>{props.label}</p>
          </div>
        </GPopup>
      )}
    </>
  );
};
