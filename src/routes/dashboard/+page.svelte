<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col items-center w-full mt-2 text-slate-50 px-4">
	<div class="grid grid-cols-4 w-full">
		<div
			class="bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 p-2 flex flex-col items-start justify-center"
		>
			<p>Welcome {data.user?.firstName}</p>
			<a
				href="/dashboard/chat/healthg"
				class="text-blue-500 hover:underline text-sm font-semibold hover:animate-bounce"
				>go to chat</a
			>
		</div>
	</div>
</div>
