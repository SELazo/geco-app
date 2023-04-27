import { FC } from 'react';
import { IHeadSectionTitle } from '../interfaces/IHeadSectionTitle';

import '../styles/gheadSectionTitle.css';

export const GHeadSectionTitle: FC<IHeadSectionTitle> = (
  props: IHeadSectionTitle
) => {
  return (
    <>
      <h1 className="geco-section-title">{props.title}</h1>
      <h5 className="geco-section-subtitle ">{props.subtitle}</h5>
    </>
  );
};
