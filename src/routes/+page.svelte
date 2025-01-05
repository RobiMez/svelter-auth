<script>
	import Header from '$lib/components/Header.svelte';
	import { Browser, SignIn } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
</script>

<div
	class="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex min-h-screen w-full justify-center bg-white dark:bg-black"
>
	<Header />

	<div class="mt-20 w-full lg:w-7/12">
		<div class="flex min-h-[80vh] items-center justify-center overflow-hidden px-6 md:px-0">
			<main class="row-start-2 flex flex-col items-center justify-center gap-4">
				<div class="flex flex-col gap-1">
					<h3 class="text-center text-5xl font-bold text-black dark:text-white">Better Auth.</h3>
					<p class="break-words text-center text-sm dark:text-white md:text-base">
						Un-Official demo to showcase <a
							href="https://better-auth.com"
							target="_blank"
							class="italic underline">better-auth's</a
						>
						features and capabilities. <br />
					</p>
				</div>
				<div class="flex w-full flex-col gap-4 md:w-10/12">
					<div class="flex flex-col flex-wrap gap-3 pt-2">
						<span class="text-center text-xs dark:text-white"
							>All features on this demo are Implemented with better auth without any custom backend
							code</span
						>
						<div class="flex flex-wrap justify-center gap-2">
							<span class="link-text">Email &amp; Password.</span><span class="link-text"
								>Organization | Teams.</span
							><span class="link-text">Passkeys.</span><span class="link-text">Multi Factor.</span
							><span class="link-text">Password Reset.</span><span class="link-text"
								>Email Verification.</span
							><span class="link-text">Roles &amp; Permissions.</span><span class="link-text"
								>Rate Limiting.</span
							><span class="link-text">Session Management.</span>
						</div>
					</div>
					{#if !$session.isPending && $session.data}
						<a class="flex justify-center" href="/dashboard">
							<Button>
								<Browser />
								<span>Dashboard</span>
							</Button>
						</a>
					{:else}
						<a class="flex justify-center" href="/sign-in">
							<Button>
								<SignIn />
								<span>Sign In</span>
							</Button>
						</a>
					{/if}
				</div>
			</main>
		</div>
	</div>
</div>

<style lang="postcss">
	.link-text {
		@apply flex cursor-pointer items-center gap-1 border-b pb-1 text-xs text-primary transition-all duration-150 ease-in-out hover:border-primary hover:text-primary dark:text-white;
	}
</style>
