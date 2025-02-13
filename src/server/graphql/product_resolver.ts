import { In } from 'typeorm';
import { LimitedTimeOffer } from '../../model/limited_time_offer';
import type { Product } from '../../model/product';
import { ProductMedia } from '../../model/product_media';
import { Review } from '../../model/review';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

export const productResolver: GraphQLModelResolver<Product> = {
  media: async (parent) => {
    console.time('productResolver.media');

    if (parent.media != null) {
      console.timeEnd('productResolver.media');
      return parent.media;
    }
    const res = await dataSource.manager.find(ProductMedia, {
      where: { product: { id: parent.id } },
      relations: { file: true },
    });

    console.timeEnd('productResolver.media');
    return res;
  },
  offers: async (parent) => {
    console.time('productResolver.offers');
    if (parent.offers != null) {
      console.timeEnd('productResolver.offers');
      return parent.offers;
    }
    const res = await dataSource.manager.find(LimitedTimeOffer, {
      where: { product: { id: parent.id } },
    });
    console.timeEnd('productResolver.offers');
    return res;
  },
  reviews: async (parent) => {
    console.time('productResolver.reviews');
    if (parent.reviews != null) {
      console.timeEnd('productResolver.reviews');
      return parent.reviews;
    }
    const res = await dataSource.manager.find(Review, {
      where: { product: { id: parent.id } },
    });
    console.timeEnd('productResolver.reviews');
    return res;
  },
};
