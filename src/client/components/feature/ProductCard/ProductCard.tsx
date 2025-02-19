import * as currencyFormatter from 'currency-formatter';
import type { FC } from 'react';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { useActiveOffer } from '../../../hooks/useActiveOffer';
import { Anchor } from '../../foundation/Anchor';
import { ProductOfferLabel } from '../../product/ProductOfferLabel';

import * as styles from './ProductCard.styles';

type Props = {
  product: ProductFragmentResponse;
};

export const ProductCard: FC<Props> = ({ product }) => {
  const thumbnailFile = product.media.find((productMedia) => productMedia.isThumbnail)?.file;
  const thumbnailFileNameWebp = thumbnailFile?.filename?.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  const { activeOffer } = useActiveOffer(product);
  const price = activeOffer?.price ?? product.price;

  return (
    <Anchor href={`/product/${product.id}`}>
      <div className={styles.inner()}>
      {thumbnailFileNameWebp ? (
        <div className={styles.image()}>
            <img 
              className={styles.container()} 
              height={126} src={thumbnailFileNameWebp} 
              width={224} 
              decoding="async" 
            />
        </div>
      ) : null}

        <div className={styles.description()}>
          <p className={styles.itemName()}>{product.name}</p>
          <span className={styles.itemPrice()}>{currencyFormatter.format(price, { code: 'JPY', precision: 0 })}</span>
        </div>
        {activeOffer !== undefined && (
          <div className={styles.label()}>
            <ProductOfferLabel size="base">タイムセール中</ProductOfferLabel>
          </div>
        )}
      </div>
    </Anchor>
  );
};
