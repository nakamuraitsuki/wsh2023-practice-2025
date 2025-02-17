import type { HttpOptions } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const asyncXhr: HttpOptions['fetch'] = (uri, options) => {
  return new Promise((resolve, reject) => {
    const method = options?.method;
    if (method === undefined) {
      return reject(new Error('Method is undefined'));
    }

    const body = options?.body;
    if (body instanceof ReadableStream) {
      return reject(new Error('Body cannot be a ReadableStream'));
    }

    const request = new XMLHttpRequest();
    request.open(method, uri.toString(), true); // 非同期に変更
    request.setRequestHeader('content-type', 'application/json');
    
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        return resolve(new Response(request.response));
      }
      reject(new Error('Request failed'));
    };

    request.onerror = () => {
      reject(new Error('Request failed'));
    };

    request.send(body);
  });
};

const link = new HttpLink({ fetch: asyncXhr });

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    mutate: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
  link,
  queryDeduplication: false,
  uri: '/graphql',
});
