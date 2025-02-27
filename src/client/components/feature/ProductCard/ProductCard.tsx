import * as currencyFormatter from 'currency-formatter';
import type { FC } from 'react';
import React, { useRef, useMemo } from 'react';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { useActiveOffer } from '../../../hooks/useActiveOffer';
import { ProductOfferLabel } from '../../product/ProductOfferLabel';

import * as styles from './ProductCard.styles';

type Props = {
  product: ProductFragmentResponse;
  index: number;
};

export const ProductCard: FC<Props> = React.memo(({ product, index }) => {
  const cacheRef = useRef(new Map<string, JSX.Element>());

  if (cacheRef.current.has(product.id.toString())) {
    return cacheRef.current.get(product.id.toString())!;
  }

  const thumbnailFile = product.media.find((productMedia) => productMedia.isThumbnail)?.file;

  // ✅ `srcSet` 用のファイル名を生成
  const thumbnailFileNames = useMemo(() => {
    if (!thumbnailFile?.filename) return null;

    return thumbnailFile.filename.replace(/\.(jpg|jpeg|png|webp)$/i, '-240w.webp');

  }, [thumbnailFile]);

  const { activeOffer } = useActiveOffer(product);
  const price = useMemo(() => activeOffer?.price ?? product.price, [activeOffer, product.price]);

  const shouldEagerLoad = index < 4;

  const renderedElement = (
    <a className={styles.Anchor_container()} href={`/product/${product.id}`}>
      <div className={styles.inner()}>
        {thumbnailFileNames && (
          <div className={styles.image()}>
            <img 
              className={styles.container()} 
              height={126} 
              width={224} 
              decoding="async" 
              loading={shouldEagerLoad ? 'eager' : 'lazy'}
              src={thumbnailFileNames}
              sizes="224px"
              alt={product.name}
            />
          </div>
        )}

        <div className={styles.description()}>
          <p className={styles.itemName()}>{product.name}</p>
          <span className={styles.itemPrice()}>
            {currencyFormatter.format(price, { code: 'JPY', precision: 0 })}
          </span>
        </div>
        {activeOffer !== undefined && (
          <div className={styles.label()}>
            <ProductOfferLabel size="base">タイムセール中</ProductOfferLabel>
          </div>
        )}
      </div>
    </a>
  );

  cacheRef.current.set(product.id.toString(), renderedElement);
  return renderedElement;
}, (prevProps, nextProps) => (prevProps.product.id === nextProps.product.id));
