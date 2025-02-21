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
    return await dataSource.manager.find(ProductMedia, {
      where: { product: { id: parent.id } },
      relations: { file: true },
    });
  },
  offers: async (parent) => {
    if (parent.offers != null) {
      return parent.offers;
    }
    return await dataSource.manager.find(LimitedTimeOffer, {
      where: { product: { id: parent.id } },
    });
  },
  reviews: async (parent) => {
    if (parent.reviews != null) {
      return parent.reviews;
    }
    return await dataSource.manager.find(Review, {
      where: { product: { id: parent.id } },
    });
  },
};
