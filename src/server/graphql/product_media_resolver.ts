import { ProductMedia } from '../../model/product_media';
import { dataSource } from '../data_source';

import type { GraphQLModelResolver } from './model_resolver';

export const productMediaResolver: GraphQLModelResolver<ProductMedia> = {
  file: async (parent) => {
    console.time('productMediaResolver.file');
    if (parent.file != null) {
      console.log("done with file");
      console.timeEnd('productMediaResolver.file');
      return parent.file;
    }
    const productMedia = await dataSource.manager.findOneOrFail(ProductMedia, {
      relations: {
        file: true,
      },
      where: { id: parent.id },
    });
    console.timeEnd('productMediaResolver.file');
    return productMedia.file;
  },
};
