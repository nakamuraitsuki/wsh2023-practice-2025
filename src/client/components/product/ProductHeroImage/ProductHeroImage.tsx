import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { Anchor } from '../../foundation/Anchor';
import { AspectRatio } from '../../foundation/AspectRatio';
import { DeviceType, GetDeviceType } from '../../foundation/GetDeviceType';
import { WidthRestriction } from '../../foundation/WidthRestriction';

import * as styles from './ProductHeroImage.styles';

type Props = {
  product: ProductFragmentResponse;
  title: string;
};

export const ProductHeroImage: FC<Props> = memo(({ product, title }) => {
  const thumbnailFile = product.media.find((productMedia) => productMedia.isThumbnail)?.file;
  const imageUrl = thumbnailFile?.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'); // 画像URLを取得

  if (!imageUrl) {
    return null; // 画像がない場合は何も表示しない
  }

  return (
    <GetDeviceType>
      {({ deviceType }) => (
        <WidthRestriction>
          <Anchor href={`/product/${product.id}`}>
            <div className={styles.container()}>
                {/* 画像を直接 src に渡す */}
                <img 
                  className={styles.image()}
                  src={imageUrl} 
                  alt={product.name} 
                  loading='eager'
                  decoding='async'
                />
              <div className={styles.overlay()}>
                <p
                  className={classNames(styles.title(), {
                    [styles.title__desktop()]: deviceType === DeviceType.DESKTOP,
                    [styles.title__mobile()]: deviceType === DeviceType.MOBILE,
                  })}
                >
                  {title}
                </p>
                <p
                  className={classNames(styles.description(), {
                    [styles.description__desktop()]: deviceType === DeviceType.DESKTOP,
                    [styles.description__mobile()]: deviceType === DeviceType.MOBILE,
                  })}
                >
                  {product.name}
                </p>
              </div>
            </div>
          </Anchor>
        </WidthRestriction>
      )}
    </GetDeviceType>
  );
}, (prevProps, nextProps) => prevProps.product.id === nextProps.product.id);

ProductHeroImage.displayName = 'ProductHeroImage';
