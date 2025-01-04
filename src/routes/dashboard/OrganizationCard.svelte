<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Label } from "$lib/components/ui/label";
    import { ChevronDown, Loader2, MailPlus } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import CopyButton from "$lib/utils/CopyButton.svelte";
	import { Plus } from "phosphor-svelte";

    // Types
    interface User {
        id: string;
        name: string;
        image: string | null;
    }

    interface Member {
        id: string;
        role: string;
        user: User;
        userId: string;
    }

    interface Invitation {
        id: string;
        email: string;
        role: string;
        status: 'pending' | 'accepted' | 'rejected';
    }

    interface Organization {
        id: string;
        name: string;
        logo: string | null;
        members: Member[];
        invitations: Invitation[];
    }

    // Mock data
    let session = {
        user: {
            id: "1",
            name: "John Doe",
            image: null
        }
    };

    let organizations = [
        {
            id: "1",
            name: "My Organization",
            logo: null,
            members: [
                {
                    id: "1",
                    role: "owner",
                    user: session.user,
                    userId: session.user.id
                }
            ],
            invitations: []
        }
    ];

    let activeOrg: Organization | null = null;
    let isRevoking: string[] = [];

    function setActiveOrg(orgId: string | null) {
        if (!orgId) {
            activeOrg = null;
            return;
        }

        const org = organizations.find(o => o.id === orgId);
        if (org) {
            activeOrg = org;
        }
    }

    async function handleRevokeInvitation(invitationId: string) {
        isRevoking = [...isRevoking, invitationId];
        
        // Mock revoke invitation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (activeOrg) {
            activeOrg = {
                ...activeOrg,
                invitations: activeOrg.invitations.filter(inv => inv.id !== invitationId)
            };
            toast.success("Invitation revoked successfully");
        }
        
        isRevoking = isRevoking.filter(id => id !== invitationId);
    }

    async function handleRemoveMember(memberId: string) {
        if (!activeOrg) return;

        // Mock remove member
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        activeOrg = {
            ...activeOrg,
            members: activeOrg.members.filter(m => m.id !== memberId)
        };
        toast.success("Member removed successfully");
    }

    $: currentMember = activeOrg?.members.find(member => member.userId === session.user.id);
</script>

<Card>
    <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div class="flex justify-between">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <div class="flex items-center gap-1 cursor-pointer">
                        <p class="text-sm">
                            <span class="font-bold"></span>
                            {activeOrg?.name || "Personal"}
                        </p>
                        <ChevronDown />
                    </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                    <DropdownMenu.Item 
                        class="py-1"
                        onclick={() => setActiveOrg(null)}
                    >
                        <p class="text-sm">Personal</p>
                    </DropdownMenu.Item>
                    {#each organizations as org}
                        <DropdownMenu.Item
                            class="py-1"
                            onclick={() => setActiveOrg(org.id)}
                        >
                            <p class="text-sm">{org.name}</p>
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <div>
                <Button size="sm" class="w-full gap-2" variant="default" onclick={() => toast.info("Create organization dialog will be added")}>
                    <Plus />
                    <p>New Organization</p>
                </Button>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <Avatar class="rounded-none">
                <AvatarImage
                    class="object-cover w-full h-full rounded-none"
                    src={activeOrg?.logo || ""}
                />
                <AvatarFallback class="rounded-none">
                    {activeOrg?.name?.charAt(0) || "P"}
                </AvatarFallback>
            </Avatar>
            <div>
                <p>{activeOrg?.name || "Personal"}</p>
                <p class="text-xs text-muted-foreground">
                    {activeOrg?.members.length || 1} members
                </p>
            </div>
        </div>
    </CardHeader>
    <CardContent>
        <div class="flex gap-8 flex-col md:flex-row">
            <div class="flex flex-col gap-2 flex-grow">
                <p class="font-medium border-b-2 border-b-foreground/10">Members</p>
                <div class="flex flex-col gap-2">
                    {#if activeOrg?.members}
                        {#each activeOrg.members as member}
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <Avatar class="sm:flex w-9 h-9">
                                        <AvatarImage
                                            src={member.user.image || ""}
                                            class="object-cover"
                                        />
                                        <AvatarFallback>
                                            {member.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p class="text-sm">{member.user.name}</p>
                                        <p class="text-xs text-muted-foreground">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                {#if member.role !== "owner" && (currentMember?.role === "owner" || currentMember?.role === "admin")}
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onclick={() => handleRemoveMember(member.id)}
                                    >
                                        {currentMember?.id === member.id ? "Leave" : "Remove"}
                                    </Button>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <div>
                            <div class="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={session.user.image || ""} />
                                    <AvatarFallback>
                                        {session.user.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p class="text-sm">{session.user.name}</p>
                                    <p class="text-xs text-muted-foreground">Owner</p>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="flex flex-col gap-2 flex-grow">
                <p class="font-medium border-b-2 border-b-foreground/10">Invites</p>
                <div class="flex flex-col gap-2">
                    {#if activeOrg?.invitations.length}
                        {#each activeOrg.invitations.filter(inv => inv.status === "pending") as invitation}
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm">{invitation.email}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {invitation.role}
                                    </p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Button
                                        disabled={isRevoking.includes(invitation.id)}
                                        size="sm"
                                        variant="destructive"
                                        onclick={() => handleRevokeInvitation(invitation.id)}
                                    >
                                        {#if isRevoking.includes(invitation.id)}
                                            <Loader2 class="animate-spin" size={16} />
                                        {:else}
                                            Revoke
                                        {/if}
                                    </Button>
                                    <div>
                                        <CopyButton textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`} />
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <p class="text-sm text-muted-foreground">
                            No Active Invitations
                        </p>
                    {/if}
                    {#if !activeOrg?.id}
                        <Label class="text-xs text-muted-foreground">
                            You can't invite members to your personal workspace.
                        </Label>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex justify-end w-full mt-4">
            <div>
                {#if activeOrg?.id}
                    <Button size="sm" class="w-full gap-2" variant="secondary" onclick={() => toast.info("Invite member dialog will be added")}>
                        <MailPlus size={16} />
                        <p>Invite Member</p>
                    </Button>
                {/if}
            </div>
        </div>
    </CardContent>
</Card>
