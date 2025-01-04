<script lang="ts">
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Table from "$lib/components/ui/table";
    import { Fingerprint, Loader2, Plus, Trash } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    // Mock data
    let passkeys = $state([
        { id: "1", name: "Work Laptop" },
        { id: "2", name: "Personal Phone" }
    ]);

    // AddPasskey Component Logic
    let addPasskeyOpen = $state(false);
    let passkeyName = $state('');
    let isAddingPasskey = $state(false);

    async function handleAddPasskey() {
        if (!passkeyName) {
            toast.error("Passkey name is required");
            return;
        }
        isAddingPasskey = true;
        // Mock add passkey functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Passkey added successfully");
        isAddingPasskey = false;
        addPasskeyOpen = false;
        passkeyName = "";
    }

    // ListPasskeys Component Logic
    let listPasskeysOpen = $state(false);
    let isDeletingPasskey = $state(false);

    async function handleDeletePasskey(id: string) {
        isDeletingPasskey = true;
        // Mock delete passkey functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Passkey deleted successfully");
        isDeletingPasskey = false;
    }
</script>

<!-- Add Passkey Dialog -->
<Dialog bind:open={addPasskeyOpen}>
    <DialogTrigger>
        <Button variant="outline" class="gap-2 text-xs md:text-sm">
            <Plus size={15} />
            Add New Passkey
        </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] w-11/12">
        <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
                Create a new passkey to securely access your account without a password.
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-2">
            <Label for="passkey-name">Passkey Name</Label>
            <Input
                id="passkey-name"
                bind:value={passkeyName}
            />
        </div>
        <DialogFooter>
            <Button
                disabled={isAddingPasskey}
                type="submit"
                onclick={handleAddPasskey}
                class="w-full"
            >
                {#if isAddingPasskey}
                    <Loader2 size={15} class="animate-spin" />
                {:else}
                    <Fingerprint class="mr-2 h-4 w-4" />
                    Create Passkey
                {/if}
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>

<!-- List Passkeys Dialog -->
<Dialog bind:open={listPasskeysOpen}>
    <DialogTrigger>
        <Button variant="outline" class="text-xs md:text-sm">
            <Fingerprint class="mr-2 h-4 w-4" />
            <span>Passkeys [{passkeys.length}]</span>
        </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] w-11/12">
        <DialogHeader>
            <DialogTitle>Passkeys</DialogTitle>
            <DialogDescription>List of passkeys</DialogDescription>
        </DialogHeader>
        {#if passkeys.length}
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Name</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each passkeys as passkey}
                        <Table.Row class="flex justify-between items-center">
                            <Table.Cell>{passkey.name || "My Passkey"}</Table.Cell>
                            <Table.Cell class="text-right">
                                <button
                                    onclick={() => handleDeletePasskey(passkey.id)}
                                >
                                    {#if isDeletingPasskey}
                                        <Loader2 size={15} class="animate-spin" />
                                    {:else}
                                        <Trash
                                            size={15}
                                            class="cursor-pointer text-red-600"
                                        />
                                    {/if}
                                </button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        {:else}
            <p class="text-sm text-muted-foreground">No passkeys found</p>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <Label for="new-passkey-name" class="text-sm">
                        New Passkey
                    </Label>
                    <Input
                        id="new-passkey-name"
                        bind:value={passkeyName}
                        placeholder="My Passkey"
                    />
                </div>
                <Button type="submit" onclick={handleAddPasskey} class="w-full">
                    {#if isAddingPasskey}
                        <Loader2 size={15} class="animate-spin" />
                    {:else}
                        <Fingerprint class="mr-2 h-4 w-4" />
                        Create Passkey
                    {/if}
                </Button>
            </div>
        {/if}
        <DialogFooter>
            <Button onclick={() => listPasskeysOpen = false}>Close</Button>
        </DialogFooter>
    </DialogContent>
</Dialog> 