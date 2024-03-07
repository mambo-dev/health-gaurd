<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { ChatT } from "$lib/db/schema";
	import { PlusCircle } from "lucide-svelte";
    export let allChats:ChatT[] | []
    
    let activeParam:string  =  $page.params.cid

    let loading = false
    let error = false
    let errorMessage = ""
    let chats:{
        display_id:string,
        active:boolean
    }[] | [] = allChats.map((chat)=>{
        return {
            display_id:chat.displayId,
            active:chat.displayId === activeParam ? true : false
        }
    })

    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                errorMessage = options.result.data.error
            }

            let allChats:ChatT[] = options.result.data.allChats

            let newChat:ChatT = options.result.data.newChat

            chats = allChats.map(chat=>{
                return {
                    display_id:chat.displayId,
                    active:chat.displayId === activeParam ? true : false
                }
            })


            loading = false
            

                await goto(`/dashboard/chat/${newChat.displayId}`);
                activeParam = newChat.displayId;
            
        }
    }

</script>

<div class="overflow-auto rounded-md bg-slate-950 border border-slate-700 shadow-xl min-h-[560px] w-1/4 gap-y-4 py-3 px-2 flex flex-col" >
    <form method="POST" use:enhance = {submitForm} class="w-full" action="?/createChat"  >      

        <button class="inline-flex items-center hover:bg-blue-500 justify-center gap-x-2 bg-blue-600 text-white font-medium py-2 px-4 w-full rounded-full" >  <PlusCircle /> { loading ? "loading..." : "new chat"}</button>
    
    
    </form>  

    <ul  class="w-full flex flex-col items-center">
        {#each chats as chat (chat.display_id)}
            <button on:click={async ()=>{
               await goto(`/dashboard/chat/${chat.display_id}`)

               activeParam = chat.display_id

            }}  class={`${chat.active && "bg-slate-700 font-semibold"} hover:bg-slate-700 hover:font-semibold active:bg-slate-700 active:font-semibold w-full inline-flex items-start justify-start font-medium outline-none rounded-md py-3 px-2`} >
                {chat.display_id }
            </button>
        {/each}
    </ul>
    </div>


