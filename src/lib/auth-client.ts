import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    baseURL: import.meta.env.BETTER_AUTH_URL as string
});

export const { signIn, signUp, useSession } = createAuthClient()