import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { config } from '../config/config';

const ENV = process.env.EXPO_PUBLIC_ENVIRONMENT;

export const { searchClient } = new TypesenseInstantsearchAdapter(config[ENV].typesense);
