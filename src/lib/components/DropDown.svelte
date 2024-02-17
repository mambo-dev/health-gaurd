<script  lang="ts">
	import { ChevronDown, ChevronUp } from "lucide-svelte";

    export let label:string = 'Options';
    export let options:string[] = [];
    export let value:string = '';
    export let buttonClassName = ""

    function chooseOption(option:string){
        value = option
        toggle = false
    }

    let toggle = false

  </script>
  
  <div class="relative">
    <button type="button" on:click={()=>(toggle = !toggle)} class={`${buttonClassName}`}>
      {label}
        {#if toggle}
        <ChevronUp class="w-5 h-5" />
        {:else}
        <ChevronDown class="w-6 h-6" />
        {/if}
   
    </button>
    {#if toggle}
    <ul class="absolute mt-2 w-48 rounded-md shadow-lg bg-slate-900 ring-1 ring-black ring-opacity-5">
        {#each options as option (option)}
          <li class="w-full" >
            <button type="button" class=" first-letter:uppercase w-full  px-4 py-2 text-sm text-slate-50 hover:bg-gray-100 hover:text-gray-900" on:click="{()=>chooseOption(option)}">
              {option}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
</div>