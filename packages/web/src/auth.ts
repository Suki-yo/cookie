import { UserManager, type User } from "oidc-client-ts";

const userManager = new UserManager({
  authority: import.meta.env.VITE_KEYCLOAK_URL ?? "http://localhost:8080/realms/cookie",
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "cookie-app",
  redirect_uri: window.location.origin + "/callback",
  response_type: "code",
  scope: "openid profile email",
});

export async function login(): Promise<void> {
  await userManager.signinRedirect();
}

export async function handleCallback(): Promise<void> {
  await userManager.signinRedirectCallback();
}

export async function logout(): Promise<void> {
  await userManager.signoutRedirect();
}

export async function getUser(): Promise<User | null> {
  return userManager.getUser();
}

export async function getToken(): Promise<string | null> {
  const user = await userManager.getUser();
  return user?.access_token ?? null;
}
