import classNames from 'classnames';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import type { FC } from 'react';

import type { FeatureSectionFragmentResponse } from '../../../graphql/fragments';
import { ProductCard } from '../ProductCard';
import { ArrowType, ProductListSlideButton } from '../ProductListSlideButton';

import * as styles from './ProductListSlider.styles';
import { useSlider } from './hooks/useSlider';

type Props = {
  featureSection: FeatureSectionFragmentResponse;
};

export const ProductListSlider: FC<Props> = ({ featureSection }) => {
  const products = featureSection.items.map((item) => item.product);

  const { setSlideIndex, slideIndex, visibleItemCount } = useSlider({
    items: products,
  });

  const itemWidth = 200; // 1アイテムの幅 (仮)
  const listWidth = itemWidth * visibleItemCount;

  return (
    <div className={styles.container()}>
      <div className={styles.slideButton()}>
        <ProductListSlideButton
          arrowType={ArrowType.LEFT}
          disabled={slideIndex === 0}
          onClick={() => setSlideIndex(slideIndex - visibleItemCount)}
        />
      </div>
      <div className={styles.listWrapper()} style={{ width: listWidth }}>
        <List
          height={250} // リストの高さ (仮)
          itemCount={products.length}
          itemSize={itemWidth}
          layout="horizontal"
          width={listWidth}
          initialScrollOffset={slideIndex * itemWidth}
        >
          {({ index, style }: ListChildComponentProps) => (
            <div style={style} className={styles.item()}>
              <ProductCard product={products[index]} />
            </div>
          )}
        </List>
      </div>
      <div className={styles.slideButton()}>
        <ProductListSlideButton
          arrowType={ArrowType.RIGHT}
          disabled={slideIndex + visibleItemCount >= products.length}
          onClick={() => setSlideIndex(slideIndex + visibleItemCount)}
        />
      </div>
    </div>
  );
};

