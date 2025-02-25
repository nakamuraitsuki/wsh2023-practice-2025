import React from 'react';
import classNames from 'classnames';
import type { FC } from 'react';
import { useState, useMemo } from 'react';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { AspectRatio } from '../../foundation/AspectRatio';

import { MediaItem } from './MediaItem';
import { MediaItemPreviewer } from './MediaItemPreviewer';
import * as styles from './ProductMediaListPreviewer.styles';

const MemoizedAspectRatio = React.memo(AspectRatio);

type Props = {
  product: ProductFragmentResponse | undefined;
};

export const ProductMediaListPreviewer: FC<Props> = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (product === undefined || product.media.length === 0) {
    return null;
  }

  const mediaList = useMemo(() => product.media, [product]);
  const activeFile = useMemo(() => mediaList[activeIndex].file, [activeIndex, mediaList]);

  const handleClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className={styles.container()}>
      <MemoizedAspectRatio ratioHeight={9} ratioWidth={16}>
        <MediaItemPreviewer file={activeFile} />
      </MemoizedAspectRatio>
      <div className={styles.itemListWrapper()}>
        <ul className={styles.itemList()}>
          {mediaList.map((media, index) => {
            const disabled = index === activeIndex;
            const buttonClass = useMemo(() => 
              classNames(styles.itemSelectButton(), { 
                [styles.itemSelectButton__disabled()]: disabled 
              }), [disabled]
            );

            return (
              <li key={media.id} className={styles.item()}>
                <MemoizedAspectRatio ratioHeight={1} ratioWidth={1}>
                  <button className={buttonClass} disabled={disabled} onClick={() => handleClick(index)}>
                    <MediaItem file={media.file} />
                  </button>
                </MemoizedAspectRatio>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
