<script lang="ts">
	import {
		DiscordLogo,
		Eye,
		EyeSlash,
		GithubLogo,
		GoogleLogo,
		TwitchLogo,
		TwitterLogo,
		WindowsLogo
	} from 'phosphor-svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	onMount(() => {
		const error = $page.url.searchParams.get('error');
		if (error === 'email_not_found') {
			toast.error('Provider did not return email');
		}
	});

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showPassword = $state(false);
	let isLoading = $state(false);

	async function handleSignIn() {
		await authClient.signIn.email(
			{
				email,
				password
			},
			{
				onRequest: () => {
					isLoading = true;
				},
				onSuccess: () => {
					toast.success('Signed in successfully');
					goto('/dashboard');
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
				onSettled: () => {
					isLoading = false;
				}
			}
		);
	}
	const signInWithGithub = async () => {
		const data = await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
		toast.success('Continuing with Github...');
	};

</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>Sign In</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			class="space-y-4"
			onsubmit={(e) => {
				e.preventDefault();
				handleSignIn();
			}}
		>
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" placeholder="m@example.com" bind:value={email} required />
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="password">Password</Label>
					<a href="/forget-password" class="text-sm text-primary hover:underline">
						Forgot your password?
					</a>
				</div>
				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						id="password"
						placeholder="••••••••••••••"
						bind:value={password}
						required
					/>
					<button
						type="button"
						class="absolute right-2 top-1/2 -translate-y-1/2"
						onclick={() => (showPassword = !showPassword)}
						disabled={isLoading}
					>
						{#if showPassword}
							<EyeSlash size={20} />
						{:else}
							<Eye size={20} />
						{/if}
					</button>
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="remember"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-neutral-300"
				/>
				<label
					for="remember"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Remember me
				</label>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading}>
				{#if isLoading}
					<span class="flex items-center gap-2">
						<svg
							class="h-4 w-4 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Signing in...
					</span>
				{:else}
					Login
				{/if}
			</Button>

			<div class="grid grid-cols-1 gap-2">
				<Button
					variant="outline"
					class="w-full"
					onclick={() => {
						signInWithGithub();
					}}
				>
					<GithubLogo size={24} weight="duotone" />
					Sign in with Github
				</Button>
			</div>

			<Button variant="outline" class="w-full" disabled>
				<span class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-key-round"
						><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle
							cx="16.5"
							cy="7.5"
							r=".5"
						/></svg
					>
					Sign-in with Passkey
				</span>
			</Button>

			<div class="text-center text-xs text-muted-foreground">
				Secured by <a href="https://better-auth.com" class="font-medium hover:underline"
					>better-auth</a
				>
			</div>
		</form>
	</Card.Content>
</Card.Root>
