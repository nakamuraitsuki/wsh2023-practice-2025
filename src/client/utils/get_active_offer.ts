import type { LimitedTimeOfferFragmentResponse } from '../graphql/fragments';

export function getActiveOffer(
  offers: LimitedTimeOfferFragmentResponse[],
): LimitedTimeOfferFragmentResponse | undefined {
  const now = new Date(); // Temporal を使わずに現在の日時を取得

  const activeOffer = offers.find((offer) => {
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);

    return startDate < now && now < endDate;
  });

  return activeOffer;
}
