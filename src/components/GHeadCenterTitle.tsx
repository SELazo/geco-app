import { FC } from 'react';

interface IHeadCenterTitleProps {
  title: string;
}

export const GHeadCenterTitle: FC<IHeadCenterTitleProps> = (
  props: IHeadCenterTitleProps
) => {
  return (
    <>
      <h1 className="geco-center-title">{props.title}</h1>
    </>
  );
};
