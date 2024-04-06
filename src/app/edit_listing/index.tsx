import { useQuery } from '@tanstack/react-query';
import SaveListing from 'components/sell/SaveListing';
import { useLocalSearchParams } from 'expo-router';
import { EditListingParams, ListingResponse } from 'types';
import { fetcher } from 'utils/fetcher';

export default function EditListingScreen() {
  const params = useLocalSearchParams<EditListingParams>();

  const user = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const listingResponse = useQuery<ListingResponse>({
    queryKey: ['listing', params.listingId],
    queryFn: () => fetcher({ body: { listingId: params.listingId }, route: '/listing/get' }),
  });

  if (listingResponse.isLoading || user.isLoading || !listingResponse.data || !user.data)
    return null;

  return (
    <SaveListing
      listing={listingResponse.data.listing}
      user={{ cardNumber: user.data.cardNumber, phone: user.data.phone }}
    />
  );
}
