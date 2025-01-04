# Stuff i did

## Basic setup

- `npx sv create`
- `pnpm add better-auth`
- Create `.env` file
- Create `src/auth.ts` file
- `pnpm i dotenv`
- Decided to use postgres

## Database

- Create `src/db.ts` file
- Install pg and types
- `pnpm i --save-dev @types/node`
- `pnpm i --save-dev @types/pg`
- Added a postgres url to `.env`
- `npx @better-auth/cli generate`
- `npx @better-auth/cli migrate`

## Authentication Setup

- Create `hooks.server.ts`
- Create `src/lib/auth-client.ts`

## Ui

- Create `src/lib/components/AuthCard.svelte`
- install phosphor-svelte
- Made ui for sign in, sign up, and forgot password
- Tried to get as close to the original design as possible
- Decided it was shit and started over with shadcn-svelte
- Turned out to be a very good decision
- LOTS of changes on this commit but ignore it and look at the next commits for auth implementations
