
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "./auth";

export async function handle({ event, resolve }) {

  // NOTE: if you want to set the session and user in the locals object, you can do it here, it lets you easily access them in your routes ( make sure to edit your d.ts file to include them )

  // const session = await auth.api.getSession({
  // 	headers: event.request.headers
  // });

  // event.locals.session = session?.session;
  // event.locals.user = session?.user;

  return svelteKitHandler({ event, resolve, auth });
}