import { FC } from 'react';

interface IHeadCenterTitleProps {
  title: string;
  color: string;
}

export const GHeadCenterTitle: FC<IHeadCenterTitleProps> = (
  props: IHeadCenterTitleProps
) => {
  return (
    <>
      <h1 className="geco-center-title" style={{ color: props.color }}>
        {props.title}
      </h1>
    </>
  );
};
