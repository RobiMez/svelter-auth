<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
	const allSessions = authClient.listSessions();

	import AccountSwitcher from '$lib/components/AccountSwitcher.svelte';
	import UserCard from './UserCard.svelte';
	import OrganizationCard from './OrganizationCard.svelte';
	
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';


	onMount(() => {
		console.log($session);

		if (!$session.isPending && !$session.data) {
			goto('/sign-in');
		}
	});
</script>

<div
	class="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex min-h-screen w-full justify-center bg-white dark:bg-black"
>
	<Header />

	<div class="mt-20 w-full lg:w-7/12">
		<div class="w-full">
			<div class="flex flex-col gap-4">
				{#if !$session.isPending}
					<AccountSwitcher session={$session} />
					<UserCard
						session={$session}
						allSessions={allSessions}
					/>
					<OrganizationCard />
				{/if}
			</div>
		</div>
	</div>
</div>
