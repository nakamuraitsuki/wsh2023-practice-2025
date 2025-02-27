import { useQuery } from '@apollo/client';
import type { GetFeatureSectionsQueryResponse } from '../graphql/queries';
import { GetFeatureSectionsQuery } from '../graphql/queries';
import { FeatureSection } from '../../model/feature_section';

export const useFeatures = () => {
  const { data, loading, error } = useQuery<GetFeatureSectionsQueryResponse>(GetFeatureSectionsQuery, {
    fetchPolicy: 'cache-first',
  });

  // 画像プリロードのためのユーティリティ関数
  const preloadImage = (url: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(); // 読み込み完了時に解決
      img.onerror = () => resolve(); // エラーが発生しても解決
    });
  };

  // 画像URLの並列取得
  const preloadImages = async (urls: string[]) => {
    // URLを置換処理をしてから重複を排除
    const modifiedUrls = Array.from(new Set(
      urls.map(url => url.replace(/\.(jpg|jpeg|png|webp)$/i, '-480w.webp'))
    ));

    // 並列で画像をプリロード
    await Promise.all(modifiedUrls.map(url => preloadImage(url)));
  };


  // featureの画像URLを取得して並列プリロード
  const preloadFeatureImages = async (features: FeatureSection[]) => {
    const imageUrls = features
      .flatMap(section => section.items)    // items配列を展開
      .flatMap(item => item.product)        // product配列を展開
      .flatMap(product => product.media)    // media配列を展開
      .filter(media => media.file.filename)           // mediaにURLが含まれている場合のみ
      .map(media => media.file.filename);             // 画像URLを取得
    
    await preloadImages(imageUrls);  // 並列で画像プリロード
  };

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

  if (features) {
    preloadFeatureImages(features as FeatureSection[]);  // 画像のプリロードを並列で実行
  }

  return { features };
};
