import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect } from 'react';

import type { MediaFileFragmentResponse } from '../../../../graphql/fragments';
import { getMediaType } from '../../../../utils/get_media_type';
import { DeviceType, GetDeviceType } from '../../../foundation/GetDeviceType';

import * as styles from './MediaItemPreiewer.styles';

type Props = {
  file: MediaFileFragmentResponse;
};

const getWebpImageSrc = (filename: string) => {
  return filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
};

export const MediaItemPreviewer: FC<Props> = ({ file }) => {
  const type = getMediaType(file.filename);

    useEffect(() => {
      if (!file) return;
      if (type !== 'image') return;
  
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getWebpImageSrc(file.filename);
      link.type = 'image/webp';
      document.head.appendChild(link);
  
      return () => {
        document.head.removeChild(link);
      };
    }, [file]);

  return (
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
  );
};
