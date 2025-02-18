import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import type { GetProductReviewsQueryResponse } from '../graphql/queries';
import { GetProductReviewsQuery } from '../graphql/queries';

export const useReviews = (productId: number | undefined) => {
  const handleError = useErrorHandler();

  console.log("productId", productId);

  // useLazyQueryで初期化
  const [loadReviews, reviewsResult] = useLazyQuery<GetProductReviewsQueryResponse>(GetProductReviewsQuery, {
    onError: handleError,
    variables: {
      productId,
    },
  });

  useEffect(() => {
    // productIdがundefinedでない場合のみクエリを実行
    if (productId === undefined) {
      return;  // productIdがundefinedなら処理を終了
    }

    // サーバー負荷が懸念される場合に少し待機
    const timer = setTimeout(() => {
      loadReviews();
    }, 1000);

    return () => {
      clearTimeout(timer);  // クリーンアップ
    };
  }, [loadReviews, productId]);  // productIdが変化したときに再実行

  const reviews = reviewsResult.data?.product.reviews;

  return { reviews };
};
