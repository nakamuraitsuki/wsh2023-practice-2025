import { In } from 'typeorm';
import DataLoader from 'dataloader';
import { LimitedTimeOffer } from '../../model/limited_time_offer';
import type { Product } from '../../model/product';
import { ProductMedia } from '../../model/product_media';
import { Review } from '../../model/review';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

// バッチ処理関数
const batchGetProductMedia = async (products: readonly Product[]) => {
  console.log("batchGetFeatureItems");
  const productIds = products.map(product => product.id);
  const medias = await dataSource.manager.find(ProductMedia, {
    where: {
      product: In(productIds),
    },
    relations: {
      product: true,
      file: true,
    },
  });

  const mediaMap = new Map<number, ProductMedia[]>();
  medias.forEach(media => {
    console.log("media",media);
    if (!mediaMap.has(media.product.id)) {
      mediaMap.set(media.product.id, []);
    }
    mediaMap.get(media.product.id)!.push(media);
  });

  return products.map(product => mediaMap.get(product.id) || []);
};

const batchGetProductOffers = async (products: readonly Product[]) => {
  const productIds = products.map(product => product.id);
  const offers = await dataSource.manager.find(LimitedTimeOffer, {
    where: {
      product: In(productIds),
    },
    relations: {
      product: true,
    },
  });

  const offersMap = new Map<number, LimitedTimeOffer[]>();
  offers.forEach(offer => {
    if (!offersMap.has(offer.product.id)) {
      offersMap.set(offer.product.id, []);
    }
    offersMap.get(offer.product.id)!.push(offer);
  });

  return products.map(product => offersMap.get(product.id) || []);
};

const batchGetProductReviews = async (products: readonly Product[]) => {
  const productIds = products.map(product => product.id);
  const reviews = await dataSource.manager.find(Review, {
    where: {
      product: In(productIds),
    },
    relations: {
      product: true,
    },
  });

  const reviewsMap = new Map<number, Review[]>();
  reviews.forEach(review => {
    if (!reviewsMap.has(review.product.id)) {
      reviewsMap.set(review.product.id, []);
    }
    reviewsMap.get(review.product.id)!.push(review);
  });

  return products.map(product => reviewsMap.get(product.id) || []);
};

// DataLoaderを作成
const productMediaLoader = new DataLoader(batchGetProductMedia);
const productOffersLoader = new DataLoader(batchGetProductOffers);
const productReviewsLoader = new DataLoader(batchGetProductReviews);

export const productResolver: GraphQLModelResolver<Product> = {
  media: (parent) => {
    console.log("media_parent",parent);
    return productMediaLoader.load(parent);
  },
  offers: (parent) => {
    return productOffersLoader.load(parent);
  },
  reviews: (parent) => {
    return productReviewsLoader.load(parent);
  },
};
