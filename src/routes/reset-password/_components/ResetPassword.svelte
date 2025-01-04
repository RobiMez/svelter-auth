<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle, Eye } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { EyeSlash } from 'phosphor-svelte';

	let password = $state('');
	let confirmPassword = $state('');
	let isSubmitting = $state(false);
	let error = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			const { data, error: resetError } = await authClient.resetPassword({
				newPassword: password
			});

			if (resetError) {
				error = resetError.message || 'An error occurred. Please try again.';
				return;
			}

			toast.success('Password reset successfully');
			goto('/sign-in');
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<main class="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle>Reset password</CardTitle>
			<CardDescription>Enter new password and confirm it to reset your password</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={handleSubmit}>
				<div class="grid w-full items-center gap-2">
					<div class="flex flex-col space-y-1.5">
						<Label for="password">New password</Label>
						<div class="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
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
									<EyeSlash class="h-4 w-4" />
								{:else}
									<Eye class="h-4 w-4" />
								{/if}
							</button>
						</div>
					</div>
					<div class="flex flex-col space-y-1.5">
						<Label for="confirmPassword">Confirm password</Label>
						<div class="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="Password"
								bind:value={confirmPassword}
								required
							/>
							<button
								type="button"
								class="absolute right-2 top-1/2 -translate-y-1/2"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
							>
								{#if showConfirmPassword}
									<EyeSlash class="h-4 w-4" />
								{:else}
									<Eye class="h-4 w-4" />
								{/if}
							</button>
						</div>
					</div>
				</div>
				{#if error}
					<Alert variant="destructive" class="mt-4">
						<AlertCircle class="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				{/if}
				<Button class="w-full mt-4" type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Resetting...' : 'Reset password'}
				</Button>
			</form>
		</CardContent>
	</Card>
</main> 