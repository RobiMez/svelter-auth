<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Select from "$lib/components/ui/select";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { MailPlus, Loader2 } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    interface Member {
        id: string;
        role: string;
        user: {
            id: string;
            name: string;
            image: string | null;
        };
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

    interface Props {
        optimisticOrg: Organization;
    }

    let {optimisticOrg}: Props = $props();

    let email = $state("");
    let value = $state("");
    let open = $state(false);
    let loading = $state(false);

    async function handleInviteMember() {
        loading = true;
        // Mock invite member functionality
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newInvitation: Invitation = {
            id: Math.random().toString(),
            email,
            role: value,
            status: "pending"
        };

        optimisticOrg = {
            ...optimisticOrg,
            invitations: [...optimisticOrg.invitations, newInvitation]
        };

        toast.success("Member invited successfully");
        loading = false;
        email = "";
        value = "";
        open = false;
    }
</script>

<Dialog.Root bind:open={open}>
    <Dialog.Trigger>
        <Button size="sm" class="w-full gap-2" variant="secondary">
            <MailPlus size={16} />
            <p>Invite Member</p>
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px] w-11/12">
        <Dialog.Header>
            <Dialog.Title>Invite Member</Dialog.Title>
            <Dialog.Description>
                Invite a member to your organization.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
                placeholder="Email"
                bind:value={email}
            />
            <Label>Role</Label>
            <Select.Root type="single" bind:value={value}>
                <Select.Trigger>
                    <span>Please select a role</span>
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="admin">Admin</Select.Item>
                    <Select.Item value="member">Member</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
        <Dialog.Footer>
            <Button
                disabled={loading}
                onclick={handleInviteMember}
            >
                {#if loading}
                    <Loader2 size={15} class="animate-spin" />
                {:else}
                    Invite
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root> 