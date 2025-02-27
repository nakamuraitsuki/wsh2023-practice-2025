import type { FC } from 'react';

import type { ReviewFragmentResponse } from '../../../graphql/fragments';

import * as styles from './ReviewList.styles';

type Props = {
  reviews: ReviewFragmentResponse[];
};

const getWebpImageSrc = (filename: string) => {
  return filename.replace(/\.(jpg|jpeg|png|gif)$/i, '-240w.webp');
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
                  src={getWebpImageSrc(review.user.profile.avatar.filename)} 
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
