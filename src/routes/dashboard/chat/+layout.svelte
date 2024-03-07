<script  lang="ts" >
    import "../../../app.css"
	import CreateChat from "$lib/components/chat/CreateChat.svelte";
	import type { LayoutData } from "../$types";
	import type { ChatT } from "$lib/db/schema";
    import { page } from "$app/stores"
    export let data:LayoutData
    
    //@ts-expect-error chats doesn't exist

    let chats :ChatT[] | [] = data.chats

    if(!chats){
        chats = []
        
    }

  


    

</script>
  


<div class="w-full text-slate-50 flex gap-x-2 items-start justify-start px-4 min-h-screen" >
    <CreateChat allChats={chats}  />

    <slot />
</div>