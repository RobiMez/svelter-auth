<script lang="ts">
   import * as Dialog from "$lib/components/ui/dialog/index.js";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Edit, Loader2, X } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let name = $state('');
    let image: File | null = null;
    let imagePreview: string | null = $state(null);
    let open = $state(false);
    let isLoading = $state(false);

    function handleImageChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            image = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleUpdateUser() {
        isLoading = true;
        // Mock update user functionality
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("User updated successfully");
        name = "";
        image = null;
        imagePreview = null;
        isLoading = false;
        open = false;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button size="sm" class="gap-2" variant="secondary">
            <Edit size={13} />
            Edit User
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px] w-11/12">
        <Dialog.Header>
            <Dialog.Title>Edit User</Dialog.Title>
            <Dialog.Description>Edit user information</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-2">
            <Label for="name">Full Name</Label>
            <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                bind:value={name}
            />
            <div class="grid gap-2">
                <Label for="image">Profile Image</Label>
                <div class="flex items-end gap-4">
                    {#if imagePreview}
                        <div class="relative w-16 h-16 rounded-sm overflow-hidden">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                class="w-full h-full object-cover"
                            />
                        </div>
                    {/if}
                    <div class="flex items-center gap-2 w-full">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onchange={handleImageChange}
                            class="w-full text-muted-foreground"
                        />
                        {#if imagePreview}
                            <button
                                onclick={() => {
                                    image = null;
                                    imagePreview = null;
                                }}
                            >
                                <X class="cursor-pointer" />
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        <Dialog.Footer>
            <Button
                disabled={isLoading}
                onclick={handleUpdateUser}
            >
                {#if isLoading}
                    <Loader2 size={15} class="animate-spin" />
                {:else}
                    Update
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
