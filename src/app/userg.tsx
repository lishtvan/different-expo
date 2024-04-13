import User from 'components/user/User';
import SearchClient from 'components/wrappers/SearchClient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserScreen() {
  return (
    <SearchClient>
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        <User />
      </SafeAreaView>
    </SearchClient>
  );
}
