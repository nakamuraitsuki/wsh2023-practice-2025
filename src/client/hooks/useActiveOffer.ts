import { useEffect, useState } from "react";
import type { LimitedTimeOfferFragmentResponse, ProductFragmentResponse } from "../graphql/fragments";
import { getActiveOffer } from "../utils/get_active_offer";

export function useActiveOffer(product: ProductFragmentResponse | undefined) {
  const [activeOffer, setActiveOffer] = useState<LimitedTimeOfferFragmentResponse | undefined>(undefined);

  useEffect(() => {
    if (!product) {
      setActiveOffer(undefined);
      return;
    }

    // 初回チェック
    setActiveOffer(getActiveOffer(product.offers));

    // 定期的にチェック（1秒ごと）
    const timer = setInterval(() => {
      setActiveOffer(getActiveOffer(product.offers));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [product]);

  return { activeOffer };
}
