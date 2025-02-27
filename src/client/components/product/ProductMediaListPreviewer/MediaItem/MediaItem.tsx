import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { MediaFileFragmentResponse } from '../../../../graphql/fragments';
import { getMediaType } from '../../../../utils/get_media_type';
import { Icon } from '../../../foundation/Icon';

import * as styles from './MediaItem.styles';

type Props = {
  file: MediaFileFragmentResponse;
};

const getWebpImageSrc = (filename: string) => {
  return filename.replace(/\.(jpg|jpeg|png|gif)$/i, '-240w.webp');
};

const getThumbnailSrc = (filename: string) => {
  return filename.replace(/^\/videos\/(.+)\.mp4$/i, '/thumbnails/$1.webp')
}

export const MediaItem: FC<Props> = ({ file }) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const mediaType = getMediaType(file.filename);

  useEffect(() => {
    if (mediaType === 'image') {
      setImageSrc(getWebpImageSrc(file.filename));
    } else if (mediaType === 'video') {
      setImageSrc(getThumbnailSrc(file.filename));
    }
  }, [file.filename, mediaType]);

  if (imageSrc === undefined) {
    return null;
  }

  return (
    <div className={styles.container()}>
      <img className={styles.image_container()} src={getWebpImageSrc(imageSrc)} decoding='async'/>
      {mediaType === 'video' && (
        <div className={styles.playIcon()}>
          <Icon color="#ffffff" height={16} type="FaPlay" width={16} />
        </div>
      )}
    </div>
  );
};
