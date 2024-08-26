import { isAndroid } from '../utils/platform';

const additionalSearchParameters = { query_by: 'title,designer' };

export const config = {
  local: {
    TYPESENSE: {
      server: {
        nodes: [
          { host: isAndroid ? '192.168.0.102' : '192.168.0.102', port: 8108, protocol: 'http' },
        ],
        apiKey: 'xyz',
      },
      additionalSearchParameters,
    },
    WS_URL: 'wss://3e1e-91-218-13-220.ngrok-free.app',
    API_URL: 'https://3e1e-91-218-13-220.ngrok-free.app',
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
