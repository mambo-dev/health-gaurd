<script lang="ts" >
	import { enhance } from "$app/forms";
	import { getChatMessages, type ReturnedMessages } from "$lib/client/getMessages";
	import { Loader2, SendHorizonal } from "lucide-svelte";


     export let displayId:string 
      let messages:ReturnedMessages | [] = []
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

        let isTyping = false

        let displayMessages = messages.map((message,index)=>{
            return {
                id:index,
                prompt:message.prompt,
                response:message.response,
            }
        })


        function startTyping(){
            if (index > response.length){
                newResponse = false
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

        
    




     function submitForm(){
        loading = true
        newResponse = false

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                errorMessage = options.result.data.error
            }
            response = options.result.data.response

            newResponse = true

            typing()

             
            prompt = message     
            displayMessages = [...displayMessages, {
                id:displayMessages.length,
                response:typedResponse,
                prompt,
            }]

            message = ""

            

            loading = false
        }
    }

</script>


<div class="relative overflow-auto  bg-slate-950 border border-slate-700 shadow-xl min-h-[560px]  flex-1 rounded-md " >
   <div class="flex items-start justify-start flex-col" >

    <div class="w-full " >
        {#each displayMessages as message (message.id) }
        <div class="bg-slate-800 border-b border-slate-700" >
            {message.prompt}
        </div>
        <div class="bg-slate-700 " >
            {newResponse ? typedResponse:message.response}
        </div>
        {/each}
        
      
    </div>
   </div>
    <div class=" px-4 bottom-0 left-0 right-0 top-full py-4 sticky  border-t border-slate-700 " >
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