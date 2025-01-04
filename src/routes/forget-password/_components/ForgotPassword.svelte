<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-svelte';

	let email = $state('');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			await resetPassword();
			isSubmitted = true;
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	async function resetPassword() {
		const { data, error } = await authClient.forgetPassword({
			email: email,
			redirectTo: '/reset-password'
		});
		console.log(data, error);
	}
</script>

{#if isSubmitted}
	<main class="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle>Check your email</CardTitle>
				<CardDescription>We've sent a password reset link to your email.</CardDescription>
			</CardHeader>
			<CardContent>
				<Alert>
					<CheckCircle2 class="h-4 w-4" />
					<AlertDescription>If you don't see the email, check your spam folder.</AlertDescription>
				</Alert>
			</CardContent>
			<CardFooter>
				<Button variant="outline" class="w-full" onclick={() => (isSubmitted = false)}>
					<ArrowLeft class="mr-2 h-4 w-4" /> Back to reset password
				</Button>
			</CardFooter>
		</Card>
	</main>
{:else}
	<main class="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
		<!-- Radial gradient for the container to give a faded look -->
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"
		></div>
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle>Forgot password</CardTitle>
				<CardDescription>Enter your email to reset your password</CardDescription>
			</CardHeader>
			<CardContent>
				<form onsubmit={handleSubmit}>
					<div class="grid w-full items-center gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								bind:value={email}
								required
							/>
						</div>
					</div>
					{#if error}
						<Alert variant="destructive" class="mt-4">
							<AlertCircle class="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					{/if}
					<Button
						class="mt-4 w-full"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Sending...' : 'Send reset link'}
					</Button>
				</form>
			</CardContent>
			<CardFooter class="flex justify-center">
				<a href="/sign-in">
					<Button variant="link" class="px-0">Back to sign in</Button>
				</a>
			</CardFooter>
		</Card>
	</main>
{/if}
