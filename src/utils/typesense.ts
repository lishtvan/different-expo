import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { config } from '../config/config';
import { Env } from '../types';

export const { searchClient } = new TypesenseInstantsearchAdapter(
  config[process.env.EXPO_PUBLIC_ENVIRONMENT as Env].typesense
);

interface BuildFilterQueryInput {
  designers: string[];
}

type BuildFilterQuery = (input: BuildFilterQueryInput) => string | undefined;

export const buildFilterQuery: BuildFilterQuery = ({ designers }) => {
  if (!designers.length) return;
  const designerString = designers.map((designer) => `\`${designer}\``).join(',');

  return `designer:=[${designerString}]`;
};
