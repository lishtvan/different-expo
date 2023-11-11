import { getSession } from './secureStorage';

interface Fetcher {
  (input: {
    route: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: { [key: string]: unknown } | unknown;
    domain?: string;
  }): Promise<any>;
}

export const fetcher: Fetcher = async ({
  route,
  body,
  method = 'POST',
  domain = process.env.EXPO_PUBLIC_API_URL,
}) => {
  console.log('fetch is happening', route);
  const headers = new Headers();

  const token = await getSession();
  if (token) headers.append('Cookie', `token=${token}`);

  let response;

  if (body) {
    headers.append('Content-type', 'application/json');
    response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else response = await fetch(`${domain}${route}`, { method, headers });

  if (response.status === 401) {
    if (route === '/auth/check') return null;
    else throw new Error('Not authorized', { cause: 401 });
  }
  if (response.status === 404) throw new Error('Not found', { cause: 404 });
  if (response.status >= 500) {
    throw new Error('Something went wrong', { cause: 500 });
  }

  const json = await response.json();
  if (json.error) {
    const { message } = json;
    return { ...json, errors: JSON.parse(message) };
  }
  return json;
};
