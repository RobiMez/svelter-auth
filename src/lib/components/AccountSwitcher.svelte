<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import * as Popover from '$lib/components/ui/popover';
	import {
		Command,
		CommandGroup,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '$lib/components/ui/command';
	import { ChevronDown, LogOut, PlusCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { session } = $props();
	let open = $state(false);
	let currentUser = $derived(session.data.user);

	
	let sessions = [
		{
			user: {
				name: 'Jane Smith',
				image: '',
				id: '2',
				email: 'jane@example.com'
			},
			session: { token: 'token2' }
		}
	];

	const handleSwitchAccount = async (sessionToken: string) => {
		// Logic to be implemented
		open = false;
	};

	const handleAddAccount = () => {
		goto('/sign-in');
		open = false;
	};
</script>

<div class="flex w-fit">
	<Popover.Root>
		<Popover.Trigger>
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a user"
				class="w-[250px] justify-between"
			>
				<Avatar class="mr-2 h-6 w-6">
					<AvatarImage src={currentUser.image} alt={currentUser.name} />
					<AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
				</Avatar>
				{currentUser.name}
				<ChevronDown class="ml-auto h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[250px] p-0" side="bottom" align="start">
			<Command>
				<CommandList>
					<CommandGroup heading="Current Account">
						<CommandItem onSelect={() => {}} class="w-full justify-between text-sm">
							<div class="flex items-center">
								<Avatar class="mr-2 h-5 w-5">
									<AvatarImage src={currentUser.image} alt={currentUser.name} />
									<AvatarFallback>
										{currentUser.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								{currentUser.name}
							</div>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Switch Account">
						{#each sessions.filter((s) => s.user.id !== currentUser.id) as session}
							<CommandItem
								onSelect={() => handleSwitchAccount(session.session.token)}
								class="text-sm"
							>
								<Avatar class="mr-2 h-5 w-5">
									<AvatarImage src={session.user.image} alt={session.user.name} />
									<AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div class="flex w-full items-center justify-between">
									<div>
										<p>{session.user.name}</p>
										<p class="text-xs">({session.user.email})</p>
									</div>
								</div>
							</CommandItem>
						{/each}
					</CommandGroup>
				</CommandList>
				<CommandSeparator />
				<CommandList>
					<CommandGroup>
						<CommandItem onSelect={handleAddAccount} class="cursor-pointer text-sm">
							<PlusCircle class="mr-2 h-5 w-5" />
							Add Account
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</Popover.Content>
	</Popover.Root>
</div>
