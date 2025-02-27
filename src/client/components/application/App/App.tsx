import type { FC } from 'react';
import { lazy, Suspense } from 'react';

import { Providers } from '../Providers';
import { Routes } from '../Routes';

const SignInModal = lazy(async() => await import('../../modal/SignInModal'));
const SignUpModal = lazy( async() => await import('../../modal/SignUpModal'));

export const App: FC = () => (
  <Providers>
    <Routes />
    <Suspense fallback={null}>
      <SignInModal />
      <SignUpModal />
    </Suspense>
  </Providers>
);
