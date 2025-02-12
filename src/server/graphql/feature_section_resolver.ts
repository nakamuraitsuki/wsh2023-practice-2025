import { FeatureSection } from '../../model/feature_section';
import { FeatureItem } from '../../model/feature_item';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

export const featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: async (parent) => {
    if (parent.items != null) {
      return parent.items;
    }
    return await dataSource.manager.find(FeatureItem, {
      where: { section: { id: parent.id } },
      relations: { product: true },
    });
  },
};
