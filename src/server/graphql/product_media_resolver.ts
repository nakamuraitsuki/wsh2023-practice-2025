import { ProductMedia } from '../../model/product_media';
import { dataSource } from '../data_source';

import type { GraphQLModelResolver } from './model_resolver';

export const productMediaResolver: GraphQLModelResolver<ProductMedia> = {
  file: async (parent) => {
    // parentがundefinedまたはnullでないかチェック
    if (!parent || !parent.id) {
      console.error('ProductMedia parent is undefined or does not have an id:', parent);
      throw new Error('ProductMedia parent is invalid');
    }

    // 正常に処理が進む場合
    const productMedia = await dataSource.manager.findOneOrFail(ProductMedia, {
      relations: {
        file: true,
      },
      where: { id: parent.id },
    });

    return productMedia.file;
  },
};
