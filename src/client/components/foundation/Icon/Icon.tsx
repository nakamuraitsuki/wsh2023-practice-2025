import classNames from 'classnames';
import type { FC } from 'react';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaUser, FaPlay, FaCheckCircle } from 'react-icons/fa';

import * as styles from './Icon.styles';

type IconType = 'FaArrowLeft' | 'FaArrowRight' | 'FaShoppingCart' | 'FaUser' | 'FaPlay' | 'FaCheckCircle';

type Props = {
  type: IconType;
  width: number;
  height: number;
  color: string;
};

export const Icon: FC<Props> = ({ color, height, type, width }) => {
  const iconMap: Record<IconType, JSX.Element> = {
    FaArrowLeft: <FaArrowLeft />,
    FaArrowRight: <FaArrowRight />,
    FaShoppingCart: <FaShoppingCart />,
    FaUser: <FaUser />,
    FaPlay: <FaPlay />,
    FaCheckCircle: <FaCheckCircle />,
  };

  const Icon = iconMap[type];
  
  return (
    <span className={classNames(type, styles.container({ color, height, width }))}>
      {Icon}
    </span>
  );
};
