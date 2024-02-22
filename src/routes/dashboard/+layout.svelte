<script  lang="ts" >
	  import { PanelsTopLeft } from "lucide-svelte";
    import "../../app.css"
	import SideBarNav from "$lib/components/SideBarNav.svelte";

    let sideOpen:boolean = true

  </script>
    


{#if sideOpen}
<div class="w-full min-h-screen flex transition-all ease-in-out delay-300" >
  <aside  class="h-full w-1/4  bg-slate-800 border-r min-h-screen  border-slate-600 p-2 px-4" >
    <div class="flex items-center gap-x-2 justify-between" >
      <a href="/" class="text-center text-3xl bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 inline-block text-transparent bg-clip-text "  >HealthGaurd</a>
      <button class="p-2 rounded-md hover:bg-slate-700" type="button" on:click={()=>{(sideOpen = !sideOpen)}} >
        <PanelsTopLeft class="w-6 h-6 text-slate-200" />
      </button>
    </div>
    <SideBarNav />
  </aside>
 
    <div class="w-full" >
      <nav class=" invisible w-full h-14 py-3 px-4 flex items-center " >
  
      </nav>
      <slot />
    </div>
  </div>
  {:else}
  <div class="w-full min-h-screen flex flex-col  transition-all ease-in-out delay-300" >
  <nav class="w-full h-14 py-3 px-4 flex items-center " >
    <div class="flex items-center gap-x-2 justify-between" >
      <button class="p-2 rounded-md hover:bg-slate-700" type="button" on:click={()=>{(sideOpen = !sideOpen)}} >
        <PanelsTopLeft class="w-6 h-6 text-slate-200" />
      </button>
    </div>
  </nav>

    <div class="w-full" >
      <slot />
    </div>
  </div>

  {/if}



       
