import { useEffect, useState } from "react";

import type { OrderFragmentResponse } from "../graphql/fragments";
import { getActiveOffer } from "../utils/get_active_offer";

export function useTotalPrice(order: OrderFragmentResponse) {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const total = order.items.reduce((sum, item) => {
      const offer = getActiveOffer(item.product.offers);
      const price = offer?.price ?? item.product.price;
      return sum + price * item.amount;
    }, 0);

    setTotalPrice(total);
  }, [order]);

  return { totalPrice };
}
