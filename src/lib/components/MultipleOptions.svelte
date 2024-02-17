<script lang="ts">
	import { Check } from "lucide-svelte";


    export let options:App.FrontEndTypes["options"]

</script>



<ul class="flex flex-col gap-y-4 text-slate-50  items-start justify-center w-full" >
    {#each Object.keys(options) as option, index (option) }
        <button  on:click={()=>{

            options[option] = {
                option:option,
                selected:!options[option].selected
            }

        }} type="button" class="  inline-flex items-center justify-between outline-none hover:cursor-pointer hover:bg-slate-800 focus:bg-slate-900 hover:font-medium  w-full mr-auto py-2 bg-slate-900 px-2 rounded-md" >
           
          
           {option}
           {#if options[option] && options[option]["selected"]  }
                <div class="rounded-full w-5 h-5 flex items-center justify-center bg-green-500  " >
                    <Check  class="w-4 h-4 font-semibold text-white"  />
                </div>
           {/if}
         
        </button>
    {/each}
 </ul>
