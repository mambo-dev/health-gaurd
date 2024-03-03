
<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import MultipleOptions from '$lib/components/MultipleOptions.svelte';
	import type { PageData } from './$types';



    let loading = false
    let error = false
    let show = false
    let message = ""
    let update = false


    
    export let data:PageData

    let userHistory:App.FrontEndTypes["options"] = {}

    let alreadySelected = data.availableHistory ? data.availableHistory?.map((history)=>{
        return history.name
    }) : []

    if(alreadySelected.length > 0 ){
        update = true
    }

    data?.historyOptions?.forEach(element => {
        userHistory[element] = {
            option:element,
            selected:alreadySelected?.includes(element) ?? false
        }

    });

    

    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                show = true
                error = true 
                message = options.result.data.error

                setTimeout(()=>{
                    show = false
                }, 5000)
            }

            if(options.result.type === "redirect"){
                await goto("/onboarding/meal-preference")
            }
            loading = false
        }
    }

</script>


<div class="max-w-xl mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="w-full  h-fit" >
        <h1  class="text-slate-50 font-medium text-2xl text-center">Do you have any of this medical conditions ?  </h1>
    </div>
    <form  method="POST" use:enhance={submitForm} class="mt-4 w-full flex flex-col items-center gap-y-3" >

        <MultipleOptions bind:options={userHistory} />
        {#each Object.keys(userHistory).filter((history)=>{
            const selected  = userHistory[history].selected;
            return selected
        }) as selectedHistory }
            <input type="hidden" name={`option-${selectedHistory.split(" ")[0]}`}  value={selectedHistory} />
        {/each}
    
        <div class="flex items-center justify-between gap-x-3 w-full mt-4 " >

            {#if update}
            <button  disabled={loading} class=" flex-1 disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Update condition"}
                </button>
            {:else}
            <button  disabled={loading} class=" flex-1 disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Save condition"}
                </button>
            {/if}
        


            <button on:click={async ()=>{
                await goto("/onboarding/meal-preference")
            }} 
            type="button"
            class=" hover:bg-slate-50 hover:text-slate-900 text-white font-medium py-2 px-4 rounded-full"
            >
            Skip
            </button>
        </div>

    </form>

    {#if error && show}
    <div  class="w-3/4 mx-auto mt-4 rounded-full py-1 flex items-center justify-center px-4 bg-red-500 text-sm text-slate-50 font-semibold">
        <p>{message}</p>
    </div>
{/if}
</div>
