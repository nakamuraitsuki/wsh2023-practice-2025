import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import type { GetProductDetailsQueryResponse } from '../graphql/queries';
import { GetProductDetailsQuery } from '../graphql/queries';

export const useProduct = (productId: number) => {
  const handleError = useErrorHandler();
  const productResult = useQuery<GetProductDetailsQueryResponse>(GetProductDetailsQuery, {
    onError: handleError,
    variables: { productId },
  });

  const product = productResult.data?.product;

  const getWebpImageSrc = (filename: string) => filename.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  const getWebpImageSrc240 = (filename: string) => filename.replace(/\.(jpg|jpeg|png|gif)$/i, '-240w.webp');

  useEffect(() => {
    if (!product?.media) return;

    const fetchImages = async () => {
      const urls = product.media.flatMap((media) => {
        if (!media.file.filename) return [];
        return [
          media.file.filename,
          getWebpImageSrc(media.file.filename),
          getWebpImageSrc240(media.file.filename),
        ];
      });

      await Promise.all(
        urls.map((url) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // 失敗しても続行
          });
        })
      );
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchImages);
    } else {
      setTimeout(fetchImages, 2000);
    }
  }, [product?.media]);

  return { product };
};
