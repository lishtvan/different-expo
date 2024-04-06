import User from 'components/user/User';
import SearchClient from 'components/wrappers/SearchClient';

export default function UserScreen() {
  return (
    <SearchClient>
      <User />
    </SearchClient>
  );
}
