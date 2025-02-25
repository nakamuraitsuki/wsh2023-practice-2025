import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';

import type { MediaFileFragmentResponse } from '../../../../graphql/fragments';
import { getMediaType } from '../../../../utils/get_media_type';
import { DeviceType, GetDeviceType } from '../../../foundation/GetDeviceType';

import * as styles from './MediaItemPreiewer.styles';

type Props = {
  file: MediaFileFragmentResponse;
};

const getWebpImageSrc = (filename: string) => filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');

export const MediaItemPreviewer: FC<Props> = ({ file }) => {
  const type = getMediaType(file.filename);

  useEffect(() => {
    if (!file || type !== 'image') return;

    const webpSrc = getWebpImageSrc(file.filename);
    const existingLink = document.head.querySelector(`link[href="${webpSrc}"]`);

    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webpSrc;
      link.type = 'image/webp';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [file, type]);

  const MemoizedVideo = useMemo(() => (
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
  ), [file.filename]);

  return (
    <div className={styles.container()}>
      {type === 'image' && <img className={styles.image_container()} src={getWebpImageSrc(file.filename)}  />}
      {type === 'video' && MemoizedVideo}
    </div>
  );
};
