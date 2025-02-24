import { memo, useEffect } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { DeviceType, GetDeviceType } from '../../foundation/GetDeviceType';
import { WidthRestriction } from '../../foundation/WidthRestriction';

import * as styles from './ProductHeroImage.styles';

type Props = {
  product: ProductFragmentResponse;
  title: string;
};

export const ProductHeroImage: FC<Props> = memo(({ product, title }) => {
  const thumbnailFile = product.media.find((productMedia) => productMedia.isThumbnail)?.file;
  const imageUrl = thumbnailFile?.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'); 

  if (!imageUrl) {
    return null;
  }

  return (
    <GetDeviceType>
      {({ deviceType }) => (
        <WidthRestriction>
          <a className={styles.Anchor_container()} href={`/product/${product.id}`}>
            <div className={styles.container()}>
                <img 
                  className={styles.image()}
                  src={imageUrl} 
                  alt={product.name} 
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
          </a>
        </WidthRestriction>
      )}
    </GetDeviceType>
  );
}, (prevProps, nextProps) => prevProps.product.id === nextProps.product.id);

ProductHeroImage.displayName = 'ProductHeroImage';
