<script lang="ts">
	import { PlusCircle } from "lucide-svelte";


</script>


<div class="w-full text-slate-50 flex items-start justify-start px-4 min-h-screen" >
    <div class="bg-slate-950 shadow-xl rounded-md  h-full w-1/4 py-3 px-2 flex flex-col" >
    <form class="w-full"  >      
        <button class="inline-flex items-center justify-center gap-x-2 bg-blue-600 text-white font-medium py-2 px-4 w-full rounded-full" ><PlusCircle />  new chat</button>
    </form>    
    </div>
    <div class="bg-slate-900  h-full" >
        chat is here
    </div>
</div>