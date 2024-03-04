import { isAndroid } from '../utils/platform';

const additionalSearchParameters = { query_by: 'title,designer' };

export const config = {
  local: {
    typesense: {
      server: {
        nodes: [{ host: isAndroid ? '192.168.1.113' : '127.0.0.1', port: 8108, protocol: 'http' }],
        apiKey: 'xyz',
      },
      additionalSearchParameters,
    },
    wsDomain: 'ws://localhost:8000',
  },
  production: {
    typesense: {
      server: {
        nodes: [{ host: 'o2by0uh958xjn1igp-1.a1.typesense.net', port: 443, protocol: 'https' }],
        apiKey: 'LStsJHZnSoNFwVXzyfJU3D9xxvvjQcyg',
      },
      additionalSearchParameters,
    },
    wsDomain: 'wss://api.different.to',
  },
};
