import { FC, useEffect, useState } from 'react';

import('../styles/gdropdownMenu.css');

import { GBlack, GWhite } from '../constants/palette';
import { GCircularButton } from './GCircularButton';
import { GMoreInfoIcon } from '../constants/buttons';
import Modal from 'react-modal';
import { usePopper } from 'react-popper';
import { GIcon } from './GIcon';
import { Link } from 'react-router-dom';

export interface IMenuItem {
  label: string;
  route: string;
  color: string;
}

interface IDropdownMenuProps {
  menu: IMenuItem[];
}

export const GDropdownMenu: FC<IDropdownMenuProps> = (
  props: IDropdownMenuProps
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
    <div className="dropdown-menu">
      <button
        className="dropdown-toggle"
        onClick={toggleMenu}
        ref={setReferenceElement}
      >
        <span>
          <GCircularButton
            icon={GMoreInfoIcon}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
          />
        </span>
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleMenu}
        contentLabel="Dropdown Menu"
        className="dropdown-modal"
        overlayClassName="dropdown-modal-overlay"
      >
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <ul className="dropdown-items">
            {props.menu.map((item, index) => (
              <li key={index}>
                <div className="dropdown-item">
                  <div className="dropdown-item-left">
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        border: '2px solid #18191f',
                      }}
                    />
                    <Link to={item.route}>{item.label}</Link>
                  </div>
                  <GIcon color={GBlack} icon-type="chevron-right" />
                </div>
                {index !== props.menu.length - 1 && <hr />}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};
