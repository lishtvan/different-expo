import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { config } from '../config/config';
import { Env } from '../types';

const env = process.env.EXPO_PUBLIC_ENVIRONMENT as Env;
export const { searchClient } = new TypesenseInstantsearchAdapter(config[env].typesense);
