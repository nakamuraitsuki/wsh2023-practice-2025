import type { HttpOptions } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const asyncFetch: HttpOptions['fetch'] = async (uri, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 100000); // タイムアウト設定

  try {
    const response = await fetch(uri.toString(), {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const link = new HttpLink({ fetch: asyncFetch });

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: false,
  link,
  queryDeduplication: true,
  uri: '/graphql',
});

export { apolloClient };
