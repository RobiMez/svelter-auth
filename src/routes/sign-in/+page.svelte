<script>
	import Header from '$lib/components/Header.svelte';
	import SignIn from './_components/SignIn.svelte';
	import SignUp from './_components/SignUp.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<div class="relative flex min-h-screen w-full justify-center bg-white dark:bg-black">
	<Header />

	<div class="mt-20 w-full max-w-md px-4">
		<!-- Sign In/Up Tabs -->
		<Tabs.Root value="signin" class="w-[400px]">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
				<Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="signup">
				<SignUp />
			</Tabs.Content>
			<Tabs.Content value="signin">
				<SignIn />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
