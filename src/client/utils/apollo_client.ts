import type { HttpOptions } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const asyncFetch: HttpOptions['fetch'] = async (uri, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 100000); // 100秒のタイムアウト

  try {
    const response = await fetch(uri.toString(), {
      ...options,
      signal: controller.signal,
      keepalive: true, // ★ Keep-Alive を有効化
      headers: {
        ...options?.headers,
        'Connection': 'keep-alive', // ★ 明示的に Keep-Alive を設定
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// HttpLink にカスタム fetch を適用
const link = new HttpLink({ fetch: asyncFetch });

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: false,
  link,
  queryDeduplication: true,
  uri: '/graphql',
});

export { apolloClient };
