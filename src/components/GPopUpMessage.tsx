import { FC, useEffect, useState } from 'react';

import('../styles/gdropdownHelp.css');
import('../styles/gstrategyItem.css');

import { GBlack, GWhite } from '../constants/palette';
import Modal from 'react-modal';
import { usePopper } from 'react-popper';

export type IPopUpMessageProps = {
  isOpen: boolean;
  title: string;
  body: string;
  body2?: string;
  btn1?: string;
  btn1Action?: () => void;
  btn2?: string;
  btn2Action?: () => void;
};

export const GPopUpMessage: FC<IPopUpMessageProps> = (
  props: IPopUpMessageProps
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  useEffect(() => {
    setIsOpen(props.isOpen);
    Modal.setAppElement('#root');
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-help">
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleMenu}
        contentLabel="Dropdown Help"
        className="gpopup-center"
        overlayClassName="dropdown-help-modal-overlay overlay-custom"
      >
        <div ref={setPopperElement} {...attributes.popper}>
          <div
            className="dropdown-help-modal-body"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <h3>{props.title}</h3>
            <p>{props.body}</p>
            <div className="geco-strategy-buttons-popup">
              {props.body2 ?? <p>{props.body2}</p>}
              {props.btn1 && (
                <button
                  className="geco-strategy-btn-options-popup"
                  onClick={props.btn1Action}
                >
                  {props.btn1}
                </button>
              )}
              {props.btn2 && (
                <button
                  className="geco-strategy-btn-options-popup"
                  style={{ backgroundColor: GBlack, color: GWhite }}
                  onClick={props.btn2Action}
                >
                  {props.btn2}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
