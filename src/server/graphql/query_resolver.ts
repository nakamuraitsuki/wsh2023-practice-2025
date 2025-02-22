import type { Context } from '@apollo/client';
import type { GraphQLFieldResolver } from 'graphql';

import { FeatureSection } from '../../model/feature_section';
import { Product } from '../../model/product';
import { Recommendation } from '../../model/recommendation';
import { User } from '../../model/user';
import { dataSource } from '../data_source';

type QueryResolver = {
  features: GraphQLFieldResolver<unknown, Context, never, Promise<FeatureSection[]>>;
  me: GraphQLFieldResolver<unknown, Context, never, Promise<User | null>>;
  product: GraphQLFieldResolver<unknown, Context, { id: number }, Promise<Product>>;
  recommendations: GraphQLFieldResolver<unknown, Context, never, Promise<Recommendation[]>>;
  user: GraphQLFieldResolver<unknown, Context, { id: number }, Promise<User>>;
};

export const queryResolver: QueryResolver = {
  features: async () => {
    const res = await dataSource.manager
      .createQueryBuilder(FeatureSection, 'section')
      .leftJoinAndSelect('section.items', 'item') // LEFT JOINに変更
      .leftJoinAndSelect('item.product', 'product') // LEFT JOINに変更
      .leftJoinAndSelect('product.media', 'media') // LEFT JOINに変更
      .leftJoinAndSelect('media.file', 'file') // LEFT JOINに変更
      .where('media.isThumbnail = :isThumbnail', { isThumbnail: true }) // isThumbnailがtrueのものだけを取得
      .getMany();  // FeatureSectionをその関連項目（FeatureItem, Product, Media, Offersなど）と一緒に取得
    return res;
  },  
  
  me: async (_parent, _args, { session }) => {
    if (session['userId'] == null) {
      return null;
    }
    return dataSource.manager.findOneOrFail(User, {
      where: { id: session['userId'] },
    });
  },
  product: (_parent, args) => {
    return dataSource.manager.findOneOrFail(Product, {
      where: { id: args.id },
    });
  },
  recommendations: async() => {
    const res = await dataSource.manager
      .createQueryBuilder(Recommendation, 'recommendation')
      .innerJoinAndSelect('recommendation.product', 'product')  // RecommendationとProductをINNER JOIN
      .innerJoinAndSelect('product.media', 'media')  // ProductとMediaをINNER JOIN
      .innerJoinAndSelect('media.file', 'file')  // MediaとFileをINNER JOIN
      .getMany();  // Recommendationとその関連データを取得  
    return res;
  },
  user: (_parent, args) => {
    return dataSource.manager.findOneOrFail(User, {
      where: { id: args.id },
    });
  },
};
