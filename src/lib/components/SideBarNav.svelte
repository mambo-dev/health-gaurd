<script lang="ts">
	const navLinks = [
		{
			name: 'Home',
			link: '/dashboard'
		},
		{
			name: 'Chat',
			link: '/dashboard/chat/healthg'
		}
	];
</script>

<ul class="flex flex-col gap-y-3 items-center text-slate-50 w-full mt-6 rounded-md">
	{#each navLinks as link (link.name)}
		<a
			href={link.link}
			class="p-2 hover:bg-blue-600 rounded-md hover:bg-opacity-65 hover:text-white hover:font-medium w-full"
			>{link.name}</a
		>
	{/each}
</ul>
