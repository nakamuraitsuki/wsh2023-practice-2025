import { In } from 'typeorm';
import DataLoader from 'dataloader';
import { FeatureSection } from '../../model/feature_section';
import { FeatureItem } from '../../model/feature_item';
import { dataSource } from '../data_source';
import { GraphQLModelResolver } from './model_resolver';

const batchGetFeatureItems = async (sections: readonly FeatureSection[]) => {
  const sectionIds = sections.map(section => section.id);
  const items = await dataSource.manager.find(FeatureItem, {
    where: {
      section: In(sectionIds),
    },
    relations: {
      product: true,
      section: true,
    },
  });

  const itemsMap = new Map<number, FeatureItem[]>();

  items.forEach(item => {
    if (!itemsMap.has(item.section.id)) {
      itemsMap.set(item.section.id, []);
    }
    itemsMap.get(item.section.id)!.push(item);
  });

  return sections.map(section => itemsMap.get(section.id) || []);
};

// DataLoaderの作成
const featureItemLoader = new DataLoader(batchGetFeatureItems);

export const featureSectionResolver: GraphQLModelResolver<FeatureSection> = {
  items: async (parent) => {
    return featureItemLoader.load(parent);
  },
};
