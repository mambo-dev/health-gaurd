<script lang="ts" >
	import { enhance } from "$app/forms";
	import { getChatMessages, type ReturnedMessages } from "$lib/client/getMessages";
	import type { MessageT } from "$lib/db/schema";
	import { Loader2, SendHorizonal } from "lucide-svelte";
	import { afterUpdate, onMount } from "svelte";
	import { fade } from "svelte/transition";


    onMount(() => {
    scrollToBottom();
  });

  afterUpdate(() => {
    scrollToBottom();
  });



     export let displayId:string 
      export let messages:ReturnedMessages | [] = []
        let message = ""
        let loading = false
        let error = false
        let errorMessage = "" 
        let prompt  = ""
        let typedResponse = ""
        let response = ""
        let typeWriter:any;
        let index = 0
        let newResponse = false
        let chatContainer:any
        let newMessageId = 0

        let isTyping = false



        function startTyping(){
            if (index > response.length || !newResponse) {
                newResponse = false;
                stopTyping();
        }

            if(index < response.length){
                isTyping = true
                typedResponse += response[index]
                index += 1
            }else{
                stopTyping()
            }
        }


        const typing = () => typeWriter = setInterval(startTyping,80) 

        function stopTyping(){
            clearInterval(typeWriter)
            isTyping = false
        }

        
        function scrollToBottom() {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }





     function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                errorMessage = options.result.data.error
            }
            const newMessage:MessageT = options.result.data.newMessage


            response = newMessage.response
            typedResponse = "";
            index = 0;
            newMessageId = newMessage.id

            messages = [...messages, newMessage];

            newResponse = true

            typing()

             
            prompt = newMessage.response     

            message = ""

            

            loading = false
        }
    }



</script>


<div class="flex flex-col relative overflow-auto  bg-slate-950 border border-slate-700 shadow-xl h-[560px] max-h-[560px]  flex-1 rounded-md " >
   <div  bind:this={chatContainer} class="flex z-0 items-start justify-start flex-col overflow-auto" >

    <div class="w-full " >
        {#each messages as message (message.id) }
        <div transition:fade={{ delay: 250, duration: 300 }} class="bg-slate-800 border-b border-slate-700 px-2 py-4 h-fit" >

            {message.prompt}
        </div>
        <div transition:fade={{ delay: 250, duration: 300 }}  class="bg-slate-700 px-2  h-fit py-4" >
            {newResponse && newMessageId === message.id ? typedResponse : message.response}
        </div>
        {/each}
        
      
    </div>

   </div>
    <div class=" px-4 z-10 bottom-0 left-0 right-0 top-full py-4 sticky  border-t border-slate-700 " >
         <form  use:enhance={submitForm}  method="POST" action="?/sendMessage" class="flex items-center gap-x-4 justify-center" >
            <input type="hidden" name="displayId" value = {displayId} />
            <textarea name="message" bind:value={message}  placeholder="start typing to ask question" class="w-full font-normal border-slate-700 border outline-none rounded-md px-2 bg-inherit py-2"/>
            <button  disabled={message.length <= 0} class="outline-none" >
                {#if loading}
                <Loader2 class="w-5 h-5 animate-spin text-slate-500" />
                {:else}
                <SendHorizonal class="w-10 h-10 text-slate-500 "  />
                {/if}
            </button>
         </form>
    </div>
</div>