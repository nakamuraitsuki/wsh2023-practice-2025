import type { FC } from 'react';
import { memo } from 'react';

import type { FeatureSectionFragmentResponse } from '../../../graphql/fragments';
import { DeviceType, GetDeviceType } from '../../foundation/GetDeviceType';
import { ProductGridList } from '../ProductGridList';
import { ProductListSlider } from '../ProductListSlider';

type Props = {
  featureSection: FeatureSectionFragmentResponse;
};

export const ProductList: FC<Props> = memo(({ featureSection }) => {
  return (
    <GetDeviceType>
      {({ deviceType }) => {
        switch (deviceType) {
          case DeviceType.DESKTOP: {
            return (
              <div style={{ minHeight: '206px' }}>
                <ProductListSlider featureSection={featureSection} />
              </div>
            );
          }
          case DeviceType.MOBILE: {
            return (
              <div style={{ minHeight: '230px' }}>
                <ProductGridList featureSection={featureSection} />
              </div>
            )
          }
        }
      }}
    </GetDeviceType>
  );
},  (prevProps, nextProps) => (prevProps.featureSection.id === nextProps.featureSection.id));

ProductList.displayName = 'ProductList';
