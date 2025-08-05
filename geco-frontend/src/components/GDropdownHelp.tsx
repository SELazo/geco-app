import { FC, useEffect, useState } from 'react';

import('../styles/gdropdownHelp.css');

import { GWhite } from '../constants/palette';
import Modal from 'react-modal';
import { usePopper } from 'react-popper';
import { GIcon } from './GIcon';

export type IDropdownHelpProps = {
  title: string;
  body: string;
  body2?: string;
  routeLabel?: string;
  route?: string;
};

export const GDropdownHelp: FC<IDropdownHelpProps> = (
  props: IDropdownHelpProps
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-help">
      <button
        className="dropdown-help-modal-toggle"
        onClick={toggleMenu}
        ref={setReferenceElement}
      >
        <GIcon icon-type="help" color={GWhite} />
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleMenu}
        contentLabel="Dropdown Help"
        className="dropdown-help-modal"
        overlayClassName="dropdown-help-modal-overlay"
      >
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="dropdown-help-modal-body">
            <h3>{props.title}</h3>
            <p>{props.body}</p>
            {props.body2 ?? <p>{props.body2}</p>}
            {props.route && (
              <a href={props.route} target="_blank" download>
                {props.routeLabel}
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
