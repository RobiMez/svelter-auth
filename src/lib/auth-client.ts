import { createAuthClient } from "better-auth/svelte";
import { passkeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.BETTER_AUTH_URL as string,
    plugins: [ 
        passkeyClient() 
    ] 
});

export const { signIn, signUp, useSession } = createAuthClient()