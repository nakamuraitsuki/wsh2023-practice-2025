import { FeatureSection } from '../../model/feature_section';
import { FeatureItem } from '../../model/feature_item';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

export const featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: async (parent) => {
    console.time('featureSectionResolver.items');
    if (parent.items != null) {
      console.timeEnd('featureSectionResolver.items');
      return parent.items;
    }
    const res = await dataSource.manager.find(FeatureItem, {
      where: { section: { id: parent.id } },
      relations: { product: true },
    });
    console.timeEnd('featureSectionResolver.items');
    return res;
  },
};
