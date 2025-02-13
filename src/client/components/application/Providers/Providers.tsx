import { ApolloProvider } from '@apollo/client';
import type { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import { Fallback } from '../../../pages/Fallback';
import { apolloClient } from '../../../utils/apollo_client';

type Props = {
  children: ReactNode;
};

export const Providers: FC<Props> = ({ children }) => (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <ErrorBoundary fallbackRender={Fallback}>
        {children}
      </ErrorBoundary>
    </BrowserRouter>
  </ApolloProvider>
);
