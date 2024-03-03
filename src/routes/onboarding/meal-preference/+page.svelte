<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DropDown from '$lib/components/DropDown.svelte';
	import type { PageData } from './$types';

    export let data:PageData

    let loading = false
    let error = false
    let message = ""
    let portionOptions = {
        small:"small",
        moderate:"moderate",
        large:"large",
    }
    let portionValue:string = '';
    let noOfMeals:number | null
    let update = false

    if(data.preference){
        update = true
        portionValue = data.preference.portionSizes ?? ""
        noOfMeals = data.preference.numberOfMeals
    
    }


   
    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                message = options.result.data.error
            }

            if(options.result.type === "redirect"){
                await goto("/onboarding/schedule")
            }
            loading = false
        }
    }

</script>


<div class="max-w-xl mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="w-full  h-fit" >
        <h1  class="text-slate-50 font-medium text-2xl text-center">Do you prefer frequent meals and smaller portions or less frequent meals and larger portions? </h1>
    </div>
    <form  method="POST" use:enhance={submitForm} class="mt-4 w-full flex flex-col items-center gap-y-3" >
    <div class="grid grid-cols-2 gap-x-3 gap-y-4 w-full" >

        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Number of meals
         <input type="number" name="numberOfMeals" value={noOfMeals}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        
        <div class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Portion sizes
            <DropDown label={portionValue.length > 0 ? portionValue : "Choose size" } bind:value={portionValue} 
            buttonClassName="first-letter:uppercase text-sm inline-flex items-center justify-between px-4 w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"
              options={Object.values(portionOptions)} />

            <input type="hidden" value={portionValue} name="portionSizes" />
        </div>
    </div>
     
        <div class="flex gap-x-3 w-full mt-4 " >
            {#if update}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "update preference"}
                </button>
            {:else}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Save preference"}
                </button>
            {/if}
    
         
        </div>

    </form>

    {#if error}
    <div  class="w-full mt-2 rounded-full py-1 flex items-center justify-center px-4 bg-red-500 text-sm text-slate-50 font-semibold">
        <p>{message}</p>
    </div>
{/if}
</div>
