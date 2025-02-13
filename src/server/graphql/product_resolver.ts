import { In } from 'typeorm';
import { LimitedTimeOffer } from '../../model/limited_time_offer';
import type { Product } from '../../model/product';
import { ProductMedia } from '../../model/product_media';
import { Review } from '../../model/review';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

export const productResolver: GraphQLModelResolver<Product> = {
  media: async (parent) => {
    if (parent.media != null) {
      return parent.media;
    }
    const res = await dataSource.manager.find(ProductMedia, {
      where: { product: { id: parent.id } },
      relations: { file: true },
    });
    return res;
  },
  offers: async (parent) => {
    if (parent.offers != null) {
      return parent.offers;
    }
    const res = await dataSource.manager.find(LimitedTimeOffer, {
      where: { product: { id: parent.id } },
    });
    return res;
  },
  reviews: async (parent) => {
    if (parent.reviews != null) {
      return parent.reviews;
    }
    const res = await dataSource.manager.find(Review, {
      where: { product: { id: parent.id } },
    });
    return res;
  },
};
