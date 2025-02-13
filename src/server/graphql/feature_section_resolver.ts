import { FeatureSection } from '../../model/feature_section';
import { FeatureItem } from '../../model/feature_item';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';
import DataLoader from 'dataloader';

export const featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: async (parent) => {
    console.time('featureSectionResolver.items');
    const res = await ItemLoader.loadMany(parent.items.map((item) => item.id));
    console.timeEnd('featureSectionResolver.items');
    // Errorやundefinedを除外してFeatureItem[]を返す
    return res.filter((item): item is FeatureItem => item instanceof FeatureItem);
  },
};

const ItemLoader = new DataLoader(async (ids: readonly number[]) => {
  const items = await dataSource
    .createQueryBuilder(FeatureItem, 'featureItem')
    .whereInIds(ids)
    .select(['featureItem.id', 'featureItem.sectionId', 'featureItem.productId'])
    .getMany();
  
  // items.find()がundefinedを返す可能性があるので、それに対処
  return ids.map((id) => {
    const item = items.find((item) => item.id === id);
    return item ?? new Error(`FeatureItem not found for ID: ${id}`);
  }) as (FeatureItem | Error)[];
});
