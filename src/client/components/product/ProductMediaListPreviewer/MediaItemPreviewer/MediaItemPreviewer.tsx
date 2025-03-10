import classNames from 'classnames';
import type { FC } from 'react';

import type { MediaFileFragmentResponse } from '../../../../graphql/fragments';
import { getMediaType } from '../../../../utils/get_media_type';
import { DeviceType, GetDeviceType } from '../../../foundation/GetDeviceType';

import * as styles from './MediaItemPreiewer.styles';
import { WidthRestriction } from '../../../foundation/WidthRestriction';

type Props = {
  file: MediaFileFragmentResponse;
};

const getWebpImageSrc = (filename: string) => {
  return filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
};

export const MediaItemPreviewer: FC<Props> = ({ file }) => {
  const type = getMediaType(file.filename);

  return (
    <WidthRestriction>
      <div className={styles.container()}>
        {type === 'image' && <img className={styles.image_container()} src={getWebpImageSrc(file.filename)} decoding='async'/>}
        {type === 'video' && (
          <GetDeviceType>
            {({ deviceType }) => (
              <video
                autoPlay
                controls
                muted
                playsInline
                className={classNames(styles.video(), {
                  [styles.video__desktop()]: deviceType === DeviceType.DESKTOP,
                  [styles.video__mobile()]: deviceType === DeviceType.MOBILE,
                })}
                src={file.filename}
              />
            )}
          </GetDeviceType>
        )}
      </div>
    </WidthRestriction>
  );
};
