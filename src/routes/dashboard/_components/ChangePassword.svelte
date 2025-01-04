<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let open = $state(false);
	let signOutDevices = $state(false);

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		if (newPassword.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		loading = true;
		// Mock password change functionality
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success('Password changed successfully');
		loading = false;
		open = false;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		<Button variant="outline" size="sm" class="gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
				></path>
			</svg>
			<span class="text-sm text-muted-foreground">Change Password</span>
		</Button>
	</DialogTrigger>
	<DialogContent class="w-11/12 sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Change Password</DialogTitle>
			<DialogDescription>Change your password</DialogDescription>
		</DialogHeader>
		<div class="grid gap-2">
			<Label for="current-password">Current Password</Label>
			<Input
				id="current-password"
				bind:value={currentPassword}
				autocomplete="new-password"
				placeholder="Password"
			/>
			<Label for="new-password">New Password</Label>
			<Input
				id="new-password"
				bind:value={newPassword}
				autocomplete="new-password"
				placeholder="New Password"
			/>
			<Label for="confirm-password">Confirm Password</Label>
			<Input
				id="confirm-password"
				bind:value={confirmPassword}
				autocomplete="new-password"
				placeholder="Confirm Password"
			/>
			<div class="flex items-center gap-2">
				<Checkbox bind:checked={signOutDevices} />
				<p class="text-sm">Sign out from other devices</p>
			</div>
		</div>
		<DialogFooter>
			<Button disabled={loading} onclick={handleChangePassword}>
				{#if loading}
					<Loader2 size={15} class="animate-spin" />
				{:else}
					Change Password
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
