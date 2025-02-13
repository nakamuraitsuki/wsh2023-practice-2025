import type { FeatureItem } from '../../model/feature_item';
import { Product } from '../../model/product';

import type { GraphQLModelResolver } from './model_resolver';
import { dataSource } from '../data_source';
import DataLoader from 'dataloader';

export const featureItemResolver: GraphQLModelResolver<FeatureItem> = {
  product: async(parent) => {
    return await ProductLoader.load(parent.id);
  },
};

const ProductLoader = new DataLoader(async (ids: readonly number[]) => {
  const products = await dataSource
    .createQueryBuilder(Product, 'product')
    .whereInIds(ids)
    .select(['product.id', 'product.name', 'product.price', 'product.description'])
    .getMany();
  return ids.map((id) => products.find((product) => product.id === id)) as Product[];
});
