<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";

    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";

    import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";

    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";

    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";


    import { Loader2, LogOut, QrCode, ShieldCheck, ShieldOff, Laptop } from "lucide-svelte";

    import { toast } from "svelte-sonner";

    import QRCode from "$lib/utils/QRCode.svelte";

    import EditUserDialog from "./_components/EditUserDialog.svelte";
    import ChangePassword from "./_components/ChangePassword.svelte";
    import PasskeyComponents from "./_components/PasskeyComponents.svelte";
	import CopyButton from "$lib/utils/CopyButton.svelte";
	import { DeviceMobile } from "phosphor-svelte";

    // Mock data and functions for demonstration
    let session = $state({
        user: {
            name: "John Doe",
            email: "john@example.com",
            image: null,
            emailVerified: false,
            twoFactorEnabled: false
        }
    });

    let activeSessions = [
        {
            id: "1",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
            token: "mock-token"
        }
    ];

    let isTerminating = $state(false);
    let isPendingTwoFa = $state(false);
    let twoFaPassword = $state("");
    let twoFactorDialog = $state(false);
    let twoFactorVerifyURI = $state("");
    let isSignOut = $state(false);
    let emailVerificationPending = $state(false);

    async function handleSignOut() {
        isSignOut = true;
        // Mock sign out functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Signed out successfully");
        isSignOut = false;
    }

    async function handleTerminateSession(sessionId: string) {
        isTerminating = true;
        // Mock terminate session functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Session terminated successfully");
        isTerminating = false;
    }

    async function handleSendVerificationEmail() {
        emailVerificationPending = true;
        // Mock send verification email functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Verification email sent successfully");
        emailVerificationPending = false;
    }

    function getDeviceIcon(userAgent: string) {
        // Simple mock implementation
        return userAgent.toLowerCase().includes("mobile") ? DeviceMobile : Laptop;
    }

    function getDeviceInfo(userAgent: string) {
        // Simple mock implementation
        return {
            os: "Windows",
            browser: "Chrome"
        };
    }
</script>

<Card>
    <CardHeader>
        <CardTitle>User</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-8 grid-cols-1">
        <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
                <Avatar class="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={session.user.image || "#"} alt="Avatar" class="object-cover" />
                    <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div class="grid gap-1">
                    <p class="text-sm font-medium leading-none">{session.user.name}</p>
                    <p class="text-sm">{session.user.email}</p>
                </div>
            </div>
            <EditUserDialog />
        </div>

        {#if !session.user.emailVerified}
            <Alert>
                <AlertTitle>Verify Your Email Address</AlertTitle>
                <AlertDescription class="text-muted-foreground">
                    Please verify your email address. Check your inbox for the verification email. 
                    If you haven't received the email, click the button below to resend.
                </AlertDescription>
                <Button 
                    size="sm" 
                    variant="secondary" 
                    class="mt-2" 
                    onclick={handleSendVerificationEmail}
                >
                    {#if emailVerificationPending}
                        <Loader2 size={15} class="animate-spin" />
                    {:else}
                        Resend Verification Email
                    {/if}
                </Button>
            </Alert>
        {/if}

        <div class="border-l-2 px-2 w-max gap-1 flex flex-col">
            <p class="text-xs font-medium">Active Sessions</p>
            {#each activeSessions as session}
            {@const ICON = getDeviceIcon(session.userAgent)}
                <div class="flex items-center gap-2 text-sm text-black font-medium dark:text-white">
                    <ICON size={16} />
                    {getDeviceInfo(session.userAgent).os}, {getDeviceInfo(session.userAgent).browser}
                    <button
                        class="text-red-500 opacity-80 cursor-pointer text-xs border-muted-foreground  underline"
                        onclick={() => handleTerminateSession(session.id)}
                    >
                        {#if isTerminating}
                            <Loader2 size={15} class="animate-spin" />
                        {:else}
                            Terminate
                        {/if}
                    </button>
                </div>
            {/each}
        </div>

        <div class="border-y py-4 flex items-center flex-wrap justify-between gap-2">
            <div class="flex flex-col gap-2">
                <p class="text-sm">Passkeys</p>
                <div class="flex gap-2 flex-wrap">
                    <PasskeyComponents />
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <p class="text-sm">Two Factor</p>
                <div class="flex gap-2">
                    {#if session.user.twoFactorEnabled}
                        <Dialog>
                            <DialogTrigger>
                                <Button variant="outline" class="gap-2">
                                    <QrCode size={16} />
                                    <span class="md:text-sm text-xs">Scan QR Code</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent class="sm:max-w-[425px] w-11/12">
                                <DialogHeader>
                                    <DialogTitle>Scan QR Code</DialogTitle>
                                    <DialogDescription>
                                        Scan the QR code with your TOTP app
                                    </DialogDescription>
                                </DialogHeader>

                                {#if twoFactorVerifyURI}
                                    <div class="flex items-center justify-center">
                                        <QRCode value={twoFactorVerifyURI} />
                                    </div>
                                    <div class="flex gap-2 items-center justify-center">
                                        <p class="text-sm text-muted-foreground">
                                            Copy URI to clipboard
                                        </p>
                                        <CopyButton textToCopy={twoFactorVerifyURI} />
                                    </div>
                                {:else}
                                    <div class="flex flex-col gap-2">
                                        <Input
                                            value={twoFaPassword}
                                            placeholder="Enter Password"
                                        />
                                        <Button
                                            onclick={() => {
                                                if (twoFaPassword.length < 8) {
                                                    toast.error("Password must be at least 8 characters");
                                                    return;
                                                }
                                                // Mock get TOTP URI functionality
                                                twoFactorVerifyURI = "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example";
                                                twoFaPassword = "";
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
                                variant={session.user.twoFactorEnabled ? "destructive" : "outline"}
                                class="gap-2"
                            >
                                {#if session.user.twoFactorEnabled}
                                    <ShieldOff size={16} />
                                {:else}
                                    <ShieldCheck size={16} />
                                {/if}
                                <span class="md:text-sm text-xs">
                                    {session.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[425px] w-11/12">
                            <DialogHeader>
                                <DialogTitle>
                                    {session.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                                </DialogTitle>
                                <DialogDescription>
                                    {session.user.twoFactorEnabled
                                        ? "Disable the second factor authentication from your account"
                                        : "Enable 2FA to secure your account"}
                                </DialogDescription>
                            </DialogHeader>

                            {#if twoFactorVerifyURI}
                                <div class="flex flex-col gap-2">
                                    <div class="flex items-center justify-center">
                                        <QRCode value={twoFactorVerifyURI} />
                                    </div>
                                    <Label for="otp">Scan the QR code with your TOTP app</Label>
                                    <Input
                                        id="otp"
                                        value={twoFaPassword}
                                        placeholder="Enter OTP"
                                    />
                                </div>
                            {:else}
                                <div class="flex flex-col gap-2">
                                    <Label for="password">Password</Label>
                                    <Input
                                        id="password"
                                        placeholder="Password"
                                        value={twoFaPassword}
                                    />
                                </div>
                            {/if}
                            <DialogFooter>
                                <Button
                                    disabled={isPendingTwoFa}
                                    onclick={async () => {
                                        if (twoFaPassword.length < 8 && !twoFactorVerifyURI) {
                                            toast.error("Password must be at least 8 characters");
                                            return;
                                        }
                                        isPendingTwoFa = true;
                                        // Mock 2FA functionality
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                        if (session.user.twoFactorEnabled) {
                                            toast.success("2FA disabled successfully");
                                            session.user.twoFactorEnabled = false;
                                        } else {
                                            if (twoFactorVerifyURI) {
                                                toast.success("2FA enabled successfully");
                                                session.user.twoFactorEnabled = true;
                                                twoFactorVerifyURI = "";
                                            } else {
                                                twoFactorVerifyURI = "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example";
                                            }
                                        }
                                        isPendingTwoFa = false;
                                        twoFaPassword = "";
                                        twoFactorDialog = false;
                                    }}
                                >
                                    {#if isPendingTwoFa}
                                        <Loader2 size={15} class="animate-spin" />
                                    {:else}
                                        {session.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                                    {/if}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    </CardContent>
    <CardFooter class="gap-2 justify-between items-center">
        <ChangePassword />
        <Button
            class="gap-2 z-10"
            variant="secondary"
            onclick={handleSignOut}
            disabled={isSignOut}
        >
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
