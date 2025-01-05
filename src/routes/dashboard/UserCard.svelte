<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';

	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';

	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { Loader2, LogOut, QrCode, ShieldCheck, ShieldOff, Laptop } from 'lucide-svelte';

	import { toast } from 'svelte-sonner';

	import QRCode from '$lib/utils/QRCode.svelte';

	import EditUserDialog from './_components/EditUserDialog.svelte';
	import ChangePassword from './_components/ChangePassword.svelte';
	import PasskeyComponents from './_components/PasskeyComponents.svelte';
	import CopyButton from '$lib/utils/CopyButton.svelte';
	import { DeviceMobile } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { session, allSessions } = $props();

	let sessions: any = $state(null);
	$inspect(sessions);

	let currentUser = $derived(session.data);

	let activeSession = $derived(currentUser.session);

	let isTerminating = $state(false);
	let isPendingTwoFa = $state(false);
	let twoFaPassword = $state('');
	let twoFactorDialog = $state(false);
	let twoFactorVerifyURI = $state('');
	let isSignOut = $state(false);
	let emailVerificationPending = $state(false);

	async function handleSignOut() {
		isSignOut = true;

		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success('Signed out successfully');
					goto('/sign-in');
				},
				onError: () => {
					toast.error('Failed to sign out');
				}
			}
		});

		isSignOut = false;
	}

	async function handleTerminateSession(token: string) {
		await authClient.revokeSession({
			token
		});

        sessions = sessions.filter((session: any) => session.token !== token);

		isTerminating = true;
		toast.success('Session terminated successfully');
		isTerminating = false;
	}

	async function handleSendVerificationEmail() {
		emailVerificationPending = true;
		// Mock send verification email functionality
		await authClient.sendVerificationEmail({
			email: currentUser.user.email,
			callbackURL: "/dashboard?emailVerified=success",
		});
		toast.success('Verification email sent successfully');
		emailVerificationPending = false;
	}

	function getDeviceIcon(userAgent: string) {
		const ua = userAgent.toLowerCase();
		if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
			return DeviceMobile;
		}
		return Laptop;
	}

	function getDeviceInfo(userAgent: string) {
		const ua = userAgent.toLowerCase();
		let os = 'Unknown';
		let browser = 'Unknown';

		// Detect OS
		if (ua.includes('windows')) {
			os = 'Windows';
		} else if (ua.includes('mac os')) {
			os = 'macOS';
		} else if (ua.includes('linux')) {
			os = 'Linux';
		} else if (ua.includes('android')) {
			os = 'Android';
		} else if (ua.includes('iphone') || ua.includes('ipad')) {
			os = 'iOS';
		}

		// Detect Browser
		if (ua.includes('firefox')) {
			browser = 'Firefox';
		} else if (ua.includes('chrome')) {
			browser = 'Chrome';
		} else if (ua.includes('safari')) {
			browser = 'Safari';
		} else if (ua.includes('edge')) {
			browser = 'Edge';
		} else if (ua.includes('opera')) {
			browser = 'Opera';
		}

		return {
			os,
			browser
		};
	}

	onMount(async () => {
		const sess = await allSessions;
		sessions = sess.data;
		// if email verified success is on urlparams, set emailVerified to true
		if (new URLSearchParams(window.location.search).get('emailVerified') === 'success') {
			toast.success('Email verified successfully');
		}


	});
</script>

<Card>
	<CardHeader>
		<CardTitle>User</CardTitle>
	</CardHeader>
	<CardContent class="grid grid-cols-1 gap-8">
		<div class="flex items-start justify-between">
			<div class="flex items-center gap-4">
				<Avatar class="hidden h-9 w-9 sm:flex">
					<AvatarImage src={currentUser.user.image || '#'} alt="Avatar" class="object-cover" />
					<AvatarFallback>{currentUser.user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div class="grid gap-1">
					<p class="text-sm font-medium leading-none">{currentUser.user.name}</p>
					<p class="text-sm">{currentUser.user.email}</p>
				</div>
			</div>
			<EditUserDialog />
		</div>

		{#if !currentUser.user.emailVerified}
			<Alert>
				<AlertTitle>Verify Your Email Address</AlertTitle>
				<AlertDescription class="text-muted-foreground">
					Please verify your email address. Check your inbox for the verification email. If you
					haven't received the email, click the button below to resend.
				</AlertDescription>
				<Button size="sm" variant="secondary" class="mt-2" onclick={handleSendVerificationEmail}>
					{#if emailVerificationPending}
						<Loader2 size={15} class="animate-spin" />
					{:else}
						Send Verification Email
					{/if}
				</Button>
			</Alert>
		{/if}

		<div class="flex w-max flex-col gap-1 border-l-2 px-2">
			<p class="text-xs font-medium">Active Sessions</p>
			{#each sessions as session}
				{@const ICON = getDeviceIcon(session.userAgent)}
				<div class="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
					<ICON size={16} />
					{getDeviceInfo(session.userAgent).os}, {getDeviceInfo(session.userAgent).browser}
					<button
						class="cursor-pointer border-muted-foreground text-xs text-red-500 underline opacity-80"
						onclick={() => handleTerminateSession(session.token)}
					>
						{#if isTerminating}
							<Loader2 size={15} class="animate-spin" />
						{:else if activeSession.id === session.id}
							Sign Out
						{:else}
							Terminate
						{/if}
					</button>
				</div>
			{/each}
		</div>

		<div class="flex flex-wrap items-center justify-between gap-2 border-y py-4">
			<div class="flex flex-col gap-2">
				<p class="text-sm">Passkeys</p>
				<div class="flex flex-wrap gap-2">
					<PasskeyComponents />
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<p class="text-sm">Two Factor</p>
				<div class="flex gap-2">
					{#if currentUser.user.twoFactorEnabled}
						<Dialog>
							<DialogTrigger>
								<Button variant="outline" class="gap-2">
									<QrCode size={16} />
									<span class="text-xs md:text-sm">Scan QR Code</span>
								</Button>
							</DialogTrigger>
							<DialogContent class="w-11/12 sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Scan QR Code</DialogTitle>
									<DialogDescription>Scan the QR code with your TOTP app</DialogDescription>
								</DialogHeader>

								{#if twoFactorVerifyURI}
									<div class="flex items-center justify-center">
										<QRCode value={twoFactorVerifyURI} />
									</div>
									<div class="flex items-center justify-center gap-2">
										<p class="text-sm text-muted-foreground">Copy URI to clipboard</p>
										<CopyButton textToCopy={twoFactorVerifyURI} />
									</div>
								{:else}
									<div class="flex flex-col gap-2">
										<Input value={twoFaPassword} placeholder="Enter Password" />
										<Button
											onclick={() => {
												if (twoFaPassword.length < 8) {
													toast.error('Password must be at least 8 characters');
													return;
												}
												// Mock get TOTP URI functionality
												twoFactorVerifyURI =
													'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example';
												twoFaPassword = '';
											}}
										>
											Show QR Code
										</Button>
									</div>
								{/if}
							</DialogContent>
						</Dialog>
					{/if}
					<Dialog bind:open={twoFactorDialog}>
						<DialogTrigger>
							<Button
								variant={currentUser.user.twoFactorEnabled ? 'destructive' : 'outline'}
								class="gap-2"
							>
								{#if currentUser.user.twoFactorEnabled}
									<ShieldOff size={16} />
								{:else}
									<ShieldCheck size={16} />
								{/if}
								<span class="text-xs md:text-sm">
									{currentUser.user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
								</span>
							</Button>
						</DialogTrigger>
						<DialogContent class="w-11/12 sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>
									{currentUser.user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
								</DialogTitle>
								<DialogDescription>
									{currentUser.user.twoFactorEnabled
										? 'Disable the second factor authentication from your account'
										: 'Enable 2FA to secure your account'}
								</DialogDescription>
							</DialogHeader>

							{#if twoFactorVerifyURI}
								<div class="flex flex-col gap-2">
									<div class="flex items-center justify-center">
										<QRCode value={twoFactorVerifyURI} />
									</div>
									<Label for="otp">Scan the QR code with your TOTP app</Label>
									<Input id="otp" value={twoFaPassword} placeholder="Enter OTP" />
								</div>
							{:else}
								<div class="flex flex-col gap-2">
									<Label for="password">Password</Label>
									<Input id="password" placeholder="Password" value={twoFaPassword} />
								</div>
							{/if}
							<DialogFooter>
								<Button
									disabled={isPendingTwoFa}
									onclick={async () => {
										if (twoFaPassword.length < 8 && !twoFactorVerifyURI) {
											toast.error('Password must be at least 8 characters');
											return;
										}
										isPendingTwoFa = true;
										// Mock 2FA functionality
										await new Promise((resolve) => setTimeout(resolve, 1000));
										if (currentUser.user.twoFactorEnabled) {
											toast.success('2FA disabled successfully');
											currentUser.user.twoFactorEnabled = false;
										} else {
											if (twoFactorVerifyURI) {
												toast.success('2FA enabled successfully');
												currentUser.user.twoFactorEnabled = true;
												twoFactorVerifyURI = '';
											} else {
												twoFactorVerifyURI =
													'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example';
											}
										}
										isPendingTwoFa = false;
										twoFaPassword = '';
										twoFactorDialog = false;
									}}
								>
									{#if isPendingTwoFa}
										<Loader2 size={15} class="animate-spin" />
									{:else}
										{currentUser.user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
									{/if}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	</CardContent>
	<CardFooter class="items-center justify-between gap-2">
		<ChangePassword />
		<Button class="z-10 gap-2" variant="secondary" onclick={handleSignOut} disabled={isSignOut}>
			<span class="text-sm">
				{#if isSignOut}
					<Loader2 size={15} class="animate-spin" />
				{:else}
					<div class="flex items-center gap-2">
						<LogOut size={16} />
						Sign Out
					</div>
				{/if}
			</span>
		</Button>
	</CardFooter>
</Card>
