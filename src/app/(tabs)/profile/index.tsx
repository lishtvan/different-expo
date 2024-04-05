import React from 'react';

import User from '../../../components/user/User';
import SearchClient from '../../../components/wrappers/SearchClient';

export default function ProfileScreen() {
  return (
    <SearchClient>
      <User />
    </SearchClient>
  );
}
