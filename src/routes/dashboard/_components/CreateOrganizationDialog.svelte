<script lang="ts">

    import * as Dialog from "$lib/components/ui/dialog";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Plus, Loader2 } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let name = $state("");
    let slug = $state("");
    let loading = $state(false);
    let open = $state(false);
    let isSlugEdited = $state(false);
    let logo = $state<string | null>(null);

    $effect(() => {
        if (!isSlugEdited) {
            slug = name.trim().toLowerCase().replace(/\s+/g, "-");
        }
    });

    $effect(() => {
        if (open) {
            name = "";
            slug = "";
            isSlugEdited = false;
            logo = null;
        }
    });

    function handleLogoChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                logo = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleCreateOrg() {
        loading = true;
        // Mock create organization
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Organization created successfully");
        loading = false;
        open = false;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button size="sm" class="w-full gap-2" variant="default">
            <Plus />
            <p>New Organization</p>
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px] w-11/12">
        <Dialog.Header>
            <Dialog.Title>New Organization</Dialog.Title>
            <Dialog.Description>
                Create a new organization to collaborate with your team.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <Label>Organization Name</Label>
                <Input
                    placeholder="Name"
                    bind:value={name}
                />
            </div>
            <div class="flex flex-col gap-2">
                <Label>Organization Slug</Label>
                <Input
                    bind:value={slug}
                    oninput={() => isSlugEdited = true}
                    placeholder="Slug"
                />
            </div>
            <div class="flex flex-col gap-2">
                <Label>Logo</Label>
                <Input 
                    type="file" 
                    accept="image/*" 
                    onchange={handleLogoChange}
                />
                {#if logo}
                    <div class="mt-2">
                        <img
                            src={logo}
                            alt="Logo preview"
                            class="w-16 h-16 object-cover"
                        />
                    </div>
                {/if}
            </div>
        </div>
        <Dialog.Footer>
            <Button
                disabled={loading}
                onclick={handleCreateOrg}
            >
                {#if loading}
                    <Loader2 class="animate-spin" size={16} />
                {:else}
                    Create
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root> 