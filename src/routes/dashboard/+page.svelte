<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
	const allSessions = authClient.listSessions();

	$inspect($session);
	// 	{
	//   "session": {
	//     "id": "CDbyl49EKens4v0lYUJivUvaXQfENluU",
	//     "expiresAt": "2025-01-11T09:06:22.812Z",
	//     "token": "xMZVj1WzT7p65jSqwNREsaqxLBFoXZ81",
	//     "createdAt": "2025-01-04T09:06:22.812Z",
	//     "updatedAt": "2025-01-04T09:06:22.812Z",
	//     "ipAddress": "",
	//     "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
	//     "userId": "wSZ6mSt41jPy3ntJI9gi9KGJcK9r5l2d"
	//   },
	//   "user": {
	//     "id": "wSZ6mSt41jPy3ntJI9gi9KGJcK9r5l2d",
	//     "name": "robi mez",
	//     "email": "robelmezemir@gmail.com",
	//     "emailVerified": false,
	//     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAQDAwQDAwQEAwQFBAQFBgoHBgYGBg0JCggKDw0QEA8NDw4RExgUERIXEg4PFRwVFxkZGxsbEBQdHx0aHxgaGxr/...",
	//     "createdAt": "2025-01-04T09:06:21.719Z",
	//     "updatedAt": "2025-01-04T09:06:21.719Z"
	//   }
	// }

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
