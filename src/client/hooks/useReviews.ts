import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";

import type { GetProductReviewsQueryResponse } from "../graphql/queries";
import { GetProductReviewsQuery } from "../graphql/queries";

export const useReviews = (productId: number | undefined) => {
  const handleError = useErrorHandler();

  // useLazyQueryで初期化（最初はクエリを実行しない）
  const [loadReviews, reviewsResult] = useLazyQuery<GetProductReviewsQueryResponse>(GetProductReviewsQuery, {
    onError: handleError,
  });

  useEffect(() => {
    if (productId === undefined) {
      return; // productIdがundefinedなら処理を終了
    }

    // 1000ms後にクエリを実行
    const timer = setTimeout(() => {
      loadReviews({ variables: { productId } });
    }, 1000);

    return () => {
      clearTimeout(timer); // クリーンアップ
    };
  }, [productId, loadReviews]); // productIdが変わったら再実行

  return { reviews: reviewsResult.data?.product.reviews };
};
