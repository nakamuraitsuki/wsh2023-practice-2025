import { FC, Suspense } from 'react';
import * as Router from 'react-router-dom';
import React from 'react';

// React.lazyを使用してコンポーネントを遅延ロード
const NotFound = React.lazy(() => import('../../../pages/NotFound').then(module => ({ default: module.NotFound })));
const Order = React.lazy(() => import('../../../pages/Order').then(module => ({ default: module.Order })));
const OrderComplete = React.lazy(() => import('../../../pages/OrderComplete').then(module => ({ default: module.OrderComplete })));
const ProductDetail = React.lazy(() => import('../../../pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Top = React.lazy(() => import('../../../pages/Top').then(module => ({ default: module.Top })));

import { useScrollToTop } from './hooks';

export const Routes: FC = () => {
  useScrollToTop();

  return (
      <Router.Routes>
        <Router.Route element={<Top />} path="/" />
        <Router.Route element={<ProductDetail />} path="/product/:productId" />
        <Router.Route element={<Order />} path="/order" />
        <Router.Route element={<OrderComplete />} path="/order/complete" />
        <Router.Route element={<NotFound />} path="*" />
      </Router.Routes>
  );
};
