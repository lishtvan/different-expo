import ListingPage from 'components/listings/ListingPage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListingScreen() {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
      <ListingPage />
    </SafeAreaView>
  );
}
