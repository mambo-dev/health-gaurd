<script lang="ts">
	import {  PlusCircle, SendHorizonal } from "lucide-svelte";
	import type { PageData } from "./$types";
	import { enhance } from "$app/forms";
	import { goto} from "$app/navigation";
	import Chat from "$lib/components/chat/Chat.svelte";
    import {page} from "$app/stores"
	import { getChatMessages, type ReturnedMessages } from "$lib/client/getMessages";
    

    export let data:PageData

    let chats  = data.chats ? data.chats?.map((chat, index)=>{
        if (index === 0){
            return {
            display_id:chat.displayId,
            active:true
        }
        }
        
        return {
            display_id:chat.displayId,
            active:false
        }
    }) : []
    let loading = false
    let error = false
    let message = ""
    let currentActiveChat = chats[0] 
    let chatMessages:ReturnedMessages | [] = []

  
    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                message = options.result.data.error
            }

            let currentChats = data.chats ? data.chats?.map(chat=>{
        return {
            display_id:chat.displayId,
            active:false
        }
    }) : []

            chats = [...currentChats, {
                display_id:options.result.data.display_id,
                active:true
            }]


            await goto(`/dashboard/chat?chat_id=${options.result.data.display_id}`)

       
            


            loading = false
        }
    }
</script>


<!-- <div class="w-full text-slate-50 flex gap-x-4 items-start justify-start px-4 min-h-screen" >
    <div class="overflow-auto rounded-md bg-slate-950 border border-slate-700 shadow-xl min-h-[560px] w-1/4 gap-y-4 py-3 px-2 flex flex-col" >
    <form method="POST" use:enhance={submitForm} class="w-full" action="?/createChat"  >      

    <button class="inline-flex items-center hover:bg-blue-500 justify-center gap-x-2 bg-blue-600 text-white font-medium py-2 px-4 w-full rounded-full" >  <PlusCircle /> { loading ? "loading..." : "new chat"}</button>


    </form>    
    <ul  class="w-full flex flex-col items-center">
        {#each chats as chat (chat.display_id)}
            <button on:click={async ()=>{
                chats = chats.map((chatm)=>{
                        return {
                            display_id:chatm.display_id,
                            active:chatm.display_id === chat.display_id ? true :false
                        }
                    })

                    await goto(`/dashboard/chat?chat_id=${chat.display_id}`)
                    currentActiveChat = {
                        display_id:chat.display_id,
                        active:true
                    }


                    chatMessages = await getChatMessages(currentActiveChat.display_id)

                

            }}  class={`${chat.active && "bg-slate-700 font-semibold"} w-full inline-flex items-start justify-start font-medium outline-none rounded-md py-3 px-2`} >
                {chat.display_id }
            </button>
        {/each}
    </ul>
    </div>
   <Chat  displayId= {currentActiveChat.display_id} messages={chatMessages} />
</div> -->