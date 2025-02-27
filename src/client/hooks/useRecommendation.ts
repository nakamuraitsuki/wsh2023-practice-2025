import { useQuery } from '@apollo/client';
import type { GetRecommendationsQueryResponse } from '../graphql/queries';
import { GetRecommendationsQuery } from '../graphql/queries';

export const useRecommendation = () => {
  const recommendationsResult = useQuery<GetRecommendationsQueryResponse>(GetRecommendationsQuery, {
    fetchPolicy: 'cache-first',
  });

  const hour = new Date().getHours();
  const recommendations = recommendationsResult?.data?.recommendations;

  if (recommendations == null) {
    return { recommendation: undefined };
  }

  const recommendation = recommendations[hour % recommendations.length];

  const thumbnailFile = recommendation.product.media.find((productMedia) => productMedia.isThumbnail)?.file;
  const imageUrl = thumbnailFile?.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'); 

  const preloadImage = (imageUrl: string) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const img = new Image();
        img.src = imageUrl;
      });
    }
  }

  if (imageUrl) {
    preloadImage(imageUrl);
  }
  
  return { recommendation };
};
