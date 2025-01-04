<script>
	import { MoonStars, SunHorizon } from 'phosphor-svelte';
	import Logo from './Logo.svelte';
</script>

<div
	class="border-border absolute z-50 flex w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-600 bg-white px-4 py-2 dark:bg-black md:px-1 lg:w-8/12"
>
	<Logo />
	<div class="z-50 flex items-center">
		<button
			class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
			on:click={() => {
				document.documentElement.classList.toggle('dark');
				if (document.documentElement.classList.contains('dark')) {
					localStorage.theme = 'dark';
				} else {
					localStorage.theme = 'light';
				}
			}}
		>
			<span class="hidden dark:block ">
				<MoonStars size={24} color="white" />
			</span>
			<span class="dark:hidden">
				<SunHorizon size={24} />
			</span>

			<span class="sr-only">Toggle theme</span></button
		>
	</div>
</div>
