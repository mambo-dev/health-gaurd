<script lang="ts">
	import { enhance } from '$app/forms';
	import { type ReturnedMessages } from '$lib/client/getMessages';
	import type { MessageT } from '$lib/db/schema';
	import { Loader2, SendHorizonal } from 'lucide-svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	onMount(() => {
		scrollToBottom();
	});

	afterUpdate(() => {
		scrollToBottom();
	});

	export let displayId: string = '';
	export let healthg: boolean;
	export let messages: ReturnedMessages | [] = [];
	let message = '';
	let sendMessageLoading = false;
	let getCategoryLoading = false;
	let error = false;
	let errorMessage = '';
	let prompt = '';
	let typedResponse = '';
	let response = '';
	let typeWriter: any;
	let index = 0;
	let newResponse = false;
	let chatContainer: any;
	let newMessageId = 0;
	let currentCategory = '';

	function startTyping() {
		if (index > response.length || !newResponse) {
			newResponse = false;
			stopTyping();
		}

		if (index < response.length) {
			typedResponse += response[index];
			index += 1;
		} else {
			stopTyping();
		}
	}

	const typing = () => (typeWriter = setInterval(startTyping, 40));

	function stopTyping() {
		clearInterval(typeWriter);
	}

	function scrollToBottom() {
		chatContainer.scrollTop = chatContainer.scollHeight;
	}

	let tips: string[] = [];
	function submitForm() {
		return async (options: any) => {
			if (options.result.type === 'failure') {
				error = true;
				errorMessage = options.result.data.error;
			}
			const newMessage: MessageT = options.result.data.newMessage;
			sendMessageLoading = false;
			getCategoryLoading = false;
			if (newMessage) {
				response = newMessage.response;
				typedResponse = '';
				index = 0;
				newMessageId = newMessage.id;

				messages = [...messages, newMessage];

				newResponse = true;

				typing();

				prompt = newMessage.response;

				message = '';

				sendMessageLoading = false;
			}

			const returnedTips = options.result.data.tips;

			if (returnedTips) {
				tips = returnedTips.tips;
			}
		};
	}

	const categories = [
		'Weight management',
		'Diabetes management',
		'Overall wellness',
		'Heart health',
		'Stress management'
	];
</script>

<form
	use:enhance={submitForm}
	method="POST"
	class="flex flex-col relative overflow-auto bg-slate-950 border border-slate-700 shadow-xl h-[560px] max-h-[560px] flex-1 rounded-md"
>
	<div bind:this={chatContainer} class="flex z-0 items-start justify-start flex-col overflow-auto">
		{#if healthg}
			<div class="w-full grid grid-cols-3 gap-3 mt-2 px-4">
				{#each categories as category (category)}
					<div>
						<input type="hidden" name="promptCategory" bind:value={currentCategory} />
						<button
							on:click={() => {
								getCategoryLoading = true;
								currentCategory = category;
							}}
							formaction="?/getResponseFromPrompt"
							class="inline-flex items-center justify-center gap-x-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-full"
						>
							{#if getCategoryLoading && currentCategory === category}
								<Loader2 class="w-5 h-5 animate-spin text-slate-500" /> Loading..
							{:else}
								{category}
							{/if}
						</button>
					</div>
				{/each}
			</div>
			<ul class="flex gap-y-2 flex-col mt-2">
				{#each tips as tip, index (tip)}
					<li
						transition:fade={{ delay: 250, duration: 300 }}
						class="bg-slate-700 px-2 h-fit py-4 flex items-start gap-x-1"
					>
						<span>{index + 1}</span>
						{tip}
					</li>
				{/each}
			</ul>
		{:else}
			<div class="w-full">
				{#each messages as message (message.id)}
					<div
						transition:fade={{ delay: 250, duration: 300 }}
						class="bg-slate-800 border-b border-slate-700 px-2 py-4 h-fit"
					>
						{message.prompt}
					</div>
					<div transition:fade={{ delay: 250, duration: 300 }} class="bg-slate-700 px-2 h-fit py-4">
						{message.response}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	{#if !healthg && displayId}
		<div class="px-4 z-10 bottom-0 left-0 right-0 top-full py-4 sticky border-t border-slate-700">
			<div class="flex items-center gap-x-4 justify-center">
				<input type="hidden" name="displayId" value={displayId} />
				<textarea
					name="message"
					bind:value={message}
					placeholder="start typing to ask question"
					class="w-full font-normal border-slate-700 border outline-none rounded-md px-2 bg-inherit py-2"
				/>
				<button
					on:click={() => {
						sendMessageLoading = true;
					}}
					formaction="?/sendMessage"
					disabled={message.length <= 0}
					class="outline-none"
				>
					{#if sendMessageLoading}
						<Loader2 class="w-5 h-5 animate-spin text-slate-500" />
					{:else}
						<SendHorizonal class="w-10 h-10 text-slate-500 " />
					{/if}
				</button>
			</div>
		</div>
	{/if}
</form>
