<script lang="ts">
	import { DiscordLogo, Eye, EyeSlash, GithubLogo, GoogleLogo } from 'phosphor-svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let profileImage: File | null = $state(null);
	let isLoading = $state(false);

	const convertImageToBase64 = async (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			alert("Passwords don't match!");
			return;
		}

		isLoading = true;
		try {
			const { data, error } = await authClient.signUp.email(
				{
					email,
					password,
					name: `${firstName} ${lastName}`,
					image: profileImage ? await convertImageToBase64(profileImage) : undefined
				},
				{
					onRequest: () => {
						isLoading = true;
					},
					onSuccess: () => {
						goto('/dashboard');
					},
					onError: (ctx) => {
						alert(ctx.error.message);
					}
				}
			);

		} catch (error) {
			alert('An error occurred during sign up');
		} finally {
			isLoading = false;
		}
	};

	const signInWithGithub = async () => {
		const data = await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
		toast.success('Continuing with Github...');
	};

	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			profileImage = input.files[0];
		}
	};
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="space-y-4" onsubmit={handleSignUp}>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="firstName">First name</Label>
					<Input type="text" id="firstName" placeholder="Max" bind:value={firstName} required />
				</div>
				<div class="space-y-2">
					<Label for="lastName">Last name</Label>
					<Input type="text" id="lastName" placeholder="Robinson" bind:value={lastName} required />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" placeholder="m@example.com" bind:value={email} required />
			</div>

			<div class="space-y-2">
				<Label for="password">Password</Label>
				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						id="password"
						placeholder="Password"
						bind:value={password}
						required
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
						required
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
					<Button
						variant="outline"
						class="w-24"
						type="button"
						onclick={() => document.getElementById('profileImage')?.click()}
					>
						Browse...
					</Button>
					<span class="text-sm text-muted-foreground">
						{profileImage ? profileImage.name : 'No file selected.'}
					</span>
					<input
						type="file"
						id="profileImage"
						accept="image/*"
						class="hidden"
						onchange={handleFileChange}
					/>
				</div>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading}>
				{isLoading ? 'Creating account...' : 'Create an account'}
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
					Continue with Github
				</Button>
			</div>

			<div class="text-center text-xs text-muted-foreground">
				Secured by <a href="https://better-auth.com" class="font-medium hover:underline"
					>better-auth</a
				>
			</div>
		</form>
	</Card.Content>
</Card.Root>
