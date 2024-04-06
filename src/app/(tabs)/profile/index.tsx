import User from 'components/user/User';
import SearchClient from 'components/wrappers/SearchClient';
import React from 'react';

export default function ProfileScreen() {
  return (
    <SearchClient>
      <User />
    </SearchClient>
  );
}
