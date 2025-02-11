import { FeatureItem } from '../../model/feature_item';
import type { FeatureSection } from '../../model/feature_section';
import { dataSource } from '../data_source';

import type { GraphQLModelResolver } from './model_resolver';
/*
const _featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: (parent) => {
    return dataSource.manager.find(FeatureItem, {
      relations: {
        product: true,
      },
      where: {
        section: parent,
      },
    });
  },
};
*/
export const featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: async(parent) => {
    return await dataSource.manager
    .createQueryBuilder(FeatureItem, 'featureItem')
    .leftJoinAndSelect('featureItem.product', 'product')
    .leftJoinAndSelect('product.media', 'media')
    .where('featureItem.sectionId = :sectionId', { sectionId: parent.id })
    .getMany();
  },
};
