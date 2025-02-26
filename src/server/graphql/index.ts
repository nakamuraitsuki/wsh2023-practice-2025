import fs from 'node:fs/promises';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

import type { Context } from '../context';
import { rootResolve } from '../utils/root_resolve';
import Keyv from 'keyv';

import { featureItemResolver } from './feature_item_resolver';
import { featureSectionResolver } from './feature_section_resolver';
import { mutationResolver } from './mutation_resolver';
import { orderResolver } from './order_resolver';
import { productMediaResolver } from './product_media_resolver';
import { productResolver } from './product_resolver';
import { profileResolver } from './profile_resolver';
import { queryResolver } from './query_resolver';
import { recommendationResolver } from './recommendation_resolver';
import { reviewResolver } from './review_resolver';
import { shoppingCartItemResolver } from './shopping_cart_item_resolver';
import { userResolver } from './user_resolver';

import { KeyValueCache, KeyValueCacheSetOptions } from '@apollo/utils.keyvaluecache';

class KeyvAdapter implements KeyValueCache<string> {
  private keyv: Keyv<string>;

  constructor(keyvInstance?: Keyv<string>) {
    this.keyv = keyvInstance ?? new Keyv(); // メモリキャッシュをデフォルトに
  }

  async get(key: string): Promise<string | undefined> {
    return await this.keyv.get(key);
  }

  async set(key: string, value: string, options?: KeyValueCacheSetOptions): Promise<void> {
    const ttl = options?.ttl ? options.ttl * 1000 : undefined; // Apolloは秒単位だが、Keyvはミリ秒
    await this.keyv.set(key, value, ttl);
  }

  async delete(key: string): Promise<boolean> {
    return await this.keyv.delete(key);
  }
}

const keyvInstance = new Keyv();

export async function initializeApolloServer(): Promise<ApolloServer<Context>> {
  const typeDefs = await Promise.all(
    [
      rootResolve('./src/model/feature_item.graphql'),
      rootResolve('./src/model/feature_section.graphql'),
      rootResolve('./src/model/limited_time_offer.graphql'),
      rootResolve('./src/model/media_file.graphql'),
      rootResolve('./src/model/order.graphql'),
      rootResolve('./src/model/product.graphql'),
      rootResolve('./src/model/product_media.graphql'),
      rootResolve('./src/model/profile.graphql'),
      rootResolve('./src/model/recommendation.graphql'),
      rootResolve('./src/model/review.graphql'),
      rootResolve('./src/model/shopping_cart_item.graphql'),
      rootResolve('./src/model/user.graphql'),
      rootResolve('./src/server/graphql/mutation.graphql'),
      rootResolve('./src/server/graphql/query.graphql'),
    ].map((filepath) => fs.readFile(filepath, { encoding: 'utf-8' })),
  );

  const server = new ApolloServer({
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }),
      ApolloServerPluginCacheControl({ defaultMaxAge: 3600 }), // これを使ってキャッシュ制御
    ],
    resolvers: {
      FeatureItem: featureItemResolver,
      FeatureSection: featureSectionResolver,
      Mutation: mutationResolver,
      Order: orderResolver,
      Product: productResolver,
      ProductMedia: productMediaResolver,
      Profile: profileResolver,
      Query: queryResolver,
      Recommendation: recommendationResolver,
      Review: reviewResolver,
      ShoppingCartItem: shoppingCartItemResolver,
      User: userResolver,
    },
    typeDefs,
    cache: new KeyvAdapter(keyvInstance),  // メモリキャッシュを追加
  });

  return server;
}
