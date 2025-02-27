import { FC, Suspense } from 'react';
import * as React from 'react';
import * as Router from 'react-router-dom';

// lazy loading
const NotFound = React.lazy(async() => await import('../../../pages/NotFound'));
const Order = React.lazy(async() => await import('../../../pages/Order'));
const OrderComplete = React.lazy(async() => await import('../../../pages/OrderComplete'));
const ProductDetail = React.lazy(async() => await import('../../../pages/ProductDetail'));
const Top = React.lazy(async() => await import('../../../pages/Top'));

import { useScrollToTop } from './hooks';

export const Routes: FC = () => {
  useScrollToTop();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router.Routes>
        <Router.Route element={<Top />} path="/" />
        <Router.Route element={<ProductDetail />} path="/product/:productId" />
        <Router.Route element={<Order />} path="/order" />
        <Router.Route element={<OrderComplete />} path="/order/complete" />
        <Router.Route element={<NotFound />} path="*" />
      </Router.Routes>
    </Suspense>
  );
};
