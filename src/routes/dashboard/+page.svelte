<script>
	import Header from '$lib/components/Header.svelte';

	import AccountSwitcher from '$lib/components/AccountSwitcher.svelte';
	import UserCard from './UserCard.svelte';
	import OrganizationCard from './OrganizationCard.svelte';
</script>

<div
	class="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex min-h-screen w-full justify-center bg-white dark:bg-black"
>
	<Header />

	<div class="mt-20 w-full lg:w-7/12">

		<div class="w-full">
			<div class="flex flex-col gap-4">
				<AccountSwitcher />
				<UserCard />
				<OrganizationCard />
			</div>
		</div>

	</div>
</div>
