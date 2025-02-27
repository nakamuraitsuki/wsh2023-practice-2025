import type { FC } from 'react';

import type { ReviewFragmentResponse } from '../../../graphql/fragments';

import * as styles from './ReviewList.styles';

type Props = {
  reviews: ReviewFragmentResponse[];
};

const getWebpImageSrc = (filename: string) => {
  const baseName = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return {
    default: `${baseName}-960w.webp`,
    srcSet: `${baseName}-240w.webp 240w, 
             ${baseName}-960w.webp 960w, 
             ${baseName}-1440w.webp 1440w`,
  };
};

export const ReviewList: FC<Props> = ({ reviews }) => {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <ul className={styles.itemList()}>
      {reviews.map((review) => {
        const endTime = new Date(review.postedAt).toLocaleString('ja-JP', {
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          month: '2-digit',
          second: '2-digit',
          year: 'numeric',
        });

        return (
          <li key={review.id} className={styles.item()} data-testid="review-list-item">
            <div className={styles.avaterImage()}>
                <img 
                  className={styles.container()} 
                  height={52} 
                  src={getWebpImageSrc(review.user.profile.avatar.filename).default} 
                  srcSet={getWebpImageSrc(review.user.profile.avatar.filename).srcSet} 
                  width={52} 
                  loading='lazy'
                  decoding="async"
                  sizes="224px"
                />
            </div>
            <div className={styles.content()}>
              <time className={styles.time()}>{endTime}</time>
              <p className={styles.comment()}>{review.comment}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
