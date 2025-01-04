<script>
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

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showPassword = $state(false);
</script>

<Card.Root class="w-full">

	<Card.Header>
		<Card.Title>Sign In</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="space-y-4">
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" placeholder="m@example.com" bind:value={email} />
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

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="remember"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-neutral-300"
				/>
				<label for="remember" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Remember me
				</label>
			</div>

			<Button type="submit" class="w-full">Login</Button>

			<div class="grid grid-cols-4 gap-2">
				<Button variant="outline" class="w-full">
					<GithubLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<DiscordLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<GoogleLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<WindowsLogo size={20} />
				</Button>
			</div>

			<div class="grid grid-cols-3 gap-2">
				<Button variant="outline" class="w-full">
					<TwitchLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<TwitterLogo size={20} />
				</Button>
				<Button variant="outline" class="w-full">
					<WindowsLogo size={20} />
				</Button>
			</div>

			<Button variant="outline" class="w-full">
				<span class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>
					Sign-in with Passkey
				</span>
			</Button>

			<div class="text-center text-xs text-muted-foreground">
				Secured by <a href="https://better-auth.com" class="font-medium hover:underline">better-auth</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>

