const DEFAULT_STRAPI_URL = "http://localhost:1337";
export const AUTH_COOKIE_NAME = "strapi_jwt";

export type StrapiUser = {
  id: number;
  username: string;
  email: string;
};

export type StrapiAuthResponse = {
  jwt: string;
  user: StrapiUser;
};

export class StrapiError extends Error {
  staus: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiError";
    this.staus = status;
  }
}

async function strapiFetch<T>(
  path: string,
  init: RequestInit = {},
  jwt?: string,
) {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  const response = await fetch(`${DEFAULT_STRAPI_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new StrapiError(
      "An error occurred while fetching data from Strapi",
      response.status,
    );
  }

  return data as T;
}

export function registerUser(
  username: string,
  email: string,
  password: string,
) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function loginUser(identifier: string, password: string) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function fetchCurrentUser(jwt: string): Promise<StrapiUser> {
  return strapiFetch<StrapiUser>(
    "/api/users/me",
    {
      method: "GET",
    },
    jwt,
  );
}
