import { Link } from 'expo-router';
import { View } from 'tamagui';

export default function MessagesScreen() {
  return (
    <View>
      <Link className="text-2xl" href="/chat">
        Chat
      </Link>
    </View>
  );
}
