import { getSession } from "./secureStorage";
import { router } from "expo-router";

interface Fetcher {
  (input: {
    route: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: { [key: string]: unknown };
    domain?: string;
  }): Promise<any>;
}

export const fetcher: Fetcher = async ({
  route,
  body,
  method = "POST",
  domain = process.env.EXPO_PUBLIC_API_URL,
}) => {
  console.log("fetch is happening");
  const headers = new Headers();
  headers.append("Content-type", "application/json");

  const session = await getSession();
  if (session) {
    const { token, userId } = JSON.parse(session);
    headers.append("Cookie", `token=${token}; userId=${userId}`);
  }

  let response;
  if (body) {
    response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(`${domain}${route}`, { method, headers });
  }

  if (response.status <= 400) {
    const json = await response.json();
    return json;
  }
  if (response.status === 401) router.replace("/auth");
  if (response.status === 404) router.replace("/404");
  if (response.status === 500) throw new Error("Something went wrong");
  // if (response.headers.get('bill') && !request.url.includes('/bill')) {
  //   throw redirect('/bill');
  // }
};
