import { isAndroid } from '../utils/platform';

const additionalSearchParameters = { query_by: 'title,designer' };

export const config = {
  local: {
    TYPESENSE: {
      server: {
        nodes: [{ host: 'o2by0uh958xjn1igp-1.a1.typesense.net', port: 443, protocol: 'https' }],
        apiKey: 'LStsJHZnSoNFwVXzyfJU3D9xxvvjQcyg',
      },
      additionalSearchParameters,
    },
    WS_URL: isAndroid ? 'wss://a1eb-176-36-11-52.ngrok-free.app' : 'ws://localhost:8000',
    API_URL: isAndroid ? 'https://a1eb-176-36-11-52.ngrok-free.app' : 'http://localhost:8000',
  },
  production: {
    TYPESENSE: {
      server: {
        nodes: [{ host: 'o2by0uh958xjn1igp-1.a1.typesense.net', port: 443, protocol: 'https' }],
        apiKey: 'LStsJHZnSoNFwVXzyfJU3D9xxvvjQcyg',
      },
      additionalSearchParameters,
    },
    WS_URL: 'wss://api.different.to',
    API_URL: 'https://api.different.to',
  },
};

export const { WS_URL, TYPESENSE, API_URL } = config[process.env.EXPO_PUBLIC_ENVIRONMENT];
