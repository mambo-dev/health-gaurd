<script lang="ts" >
	import { SendHorizonal } from "lucide-svelte";
    import {page } from "$app/stores"

    console.log($page.url.search.split("?")[1].split("=")[1])
     let chatId:string = ""

</script>


<div class="relative overflow-auto  bg-slate-950 border border-slate-700 shadow-xl min-h-[560px]  flex-1 rounded-md " >
    {chatId}
    <div class=" px-4 bottom-0 left-0 right-0 top-full py-4 sticky  border-t border-slate-700 " >
         <form action="POST" class="flex items-center gap-x-4 justify-center" >
            <textarea placeholder="start typing to ask question" class="w-full font-normal border-slate-700 border outline-none rounded-md px-2 bg-inherit py-2"/>
            <button class="outline-none" ><SendHorizonal class="w-10 h-10"  /></button>
         </form>
    </div>
</div>