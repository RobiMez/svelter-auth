<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Copy, Check } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { onDestroy } from "svelte";

    export let textToCopy: string;

    let isCopied = false;
    let timer: NodeJS.Timeout;

    $: if (isCopied) {
        timer = setTimeout(() => {
            isCopied = false;
        }, 2000);
    }

    onDestroy(() => {
        if (timer) {
            clearTimeout(timer);
        }
    });

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(textToCopy);
            isCopied = true;
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }
</script>

<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Button
                variant="link"
                size="icon"
                onclick={handleCopy}
                class="h-8 w-8"
            >
                {#if isCopied}
                    <Check class="h-4 w-4" />
                {:else}
                    <Copy class="h-4 w-4" />
                {/if}
                <span class="sr-only">Copy to clipboard</span>
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider> 