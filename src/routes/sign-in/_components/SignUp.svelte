<script>
	import { DiscordLogo, Eye, EyeSlash, GithubLogo, GoogleLogo } from 'phosphor-svelte';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
</script>

<Card.Root class="w-full">

	<Card.Header>
		<Card.Title>Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="firstName">First name</Label>
					<Input type="text" id="firstName" placeholder="Max" bind:value={firstName} />
				</div>
				<div class="space-y-2">
					<Label for="lastName">Last name</Label>
					<Input type="text" id="lastName" placeholder="Robinson" bind:value={lastName} />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" placeholder="m@example.com" bind:value={email} />
			</div>

			<div class="space-y-2">
				<Label for="password">Password</Label>
				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						id="password"
						placeholder="Password"
						bind:value={password}
					/>
					<button
						type="button"
						class="absolute right-2 top-1/2 -translate-y-1/2"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeSlash size={20} />
						{:else}
							<Eye size={20} />
						{/if}
					</button>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="confirmPassword">Confirm Password</Label>
				<div class="relative">
					<Input
						type={showConfirmPassword ? 'text' : 'password'}
						id="confirmPassword"
						placeholder="Confirm Password"
						bind:value={confirmPassword}
					/>
					<button
						type="button"
						class="absolute right-2 top-1/2 -translate-y-1/2"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
					>
						{#if showConfirmPassword}
							<EyeSlash size={20} />
						{:else}
							<Eye size={20} />
						{/if}
					</button>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="profileImage">Profile Image (optional)</Label>
				<div class="flex items-center gap-2">
					<Button variant="outline" class="w-24">Browse...</Button>
					<span class="text-sm text-muted-foreground">No file selected.</span>
				</div>
			</div>

			<Button type="submit" class="w-full">Create an account</Button>

			<div class="grid grid-cols-3 gap-2">
				<Button variant="outline" class="w-full">
					<GithubLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<DiscordLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<GoogleLogo size={20} />
				</Button>
			</div>

			<div class="text-center text-xs text-muted-foreground">
				Secured by <a href="https://better-auth.com" class="font-medium hover:underline">better-auth</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
