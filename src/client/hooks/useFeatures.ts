import { useQuery } from '@apollo/client';
import type { GetFeatureSectionsQueryResponse } from '../graphql/queries';
import { GetFeatureSectionsQuery } from '../graphql/queries';

export const useFeatures = () => {
  const { data, loading, error } = useQuery<GetFeatureSectionsQueryResponse>(GetFeatureSectionsQuery, {
    fetchPolicy: 'cache-first',
  });

  if (loading) {
    // ローディング中の処理（例：スピナー表示など）
    return { loading: true };
  }

  if (error) {
    // エラーが発生した場合の処理
    console.error(error);
    return { error: error.message };
  }

  const features = data?.features;

  return { features };
};
