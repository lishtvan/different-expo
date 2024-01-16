import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { config } from '../config/config';
import { Env } from '../types';

export const { searchClient } = new TypesenseInstantsearchAdapter(
  config[process.env.EXPO_PUBLIC_ENVIRONMENT as Env].typesense
);
