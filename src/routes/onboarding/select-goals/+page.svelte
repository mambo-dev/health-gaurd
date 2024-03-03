
<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import MultipleOptions from '$lib/components/MultipleOptions.svelte';
	import type { PageData, PageServerData } from './$types';



    let loading = false
    let error = false
    let show = false
    let message = ""
    let update = false


    
    export let data:PageData

    let userGoals:App.FrontEndTypes["options"] = {}

    let alreadySelected = data.goals ? data.goals?.map((goal)=>{
        return goal.title
    }) : []

    data.goal_options.forEach(element => {
        userGoals[element] = {
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
                await goto("/onboarding/medical-history")
            }
            loading = false
        }
    }

</script>


<div class="max-w-xl mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="w-full  h-fit" >
        <h1  class="text-slate-50 font-medium text-2xl text-center">What are your main goals, Tip: you can pick more than one</h1>
    </div>
    <form  method="POST" use:enhance={submitForm} class="mt-4 w-full flex flex-col items-center gap-y-3" >

        <MultipleOptions bind:options={userGoals} />
        {#each Object.keys(userGoals).filter((goal)=>{
            const selected  = userGoals[goal].selected;
            return selected
        }) as selectedGoal }
            <input type="hidden" name={`option-${selectedGoal.split(" ")[0]}`}  value={selectedGoal} />
        {/each}
    
        <div class="flex gap-x-3 w-3/4 mt-4 " >
        
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
            { loading ? "loading..." : "Save goals"}
            </button>
        </div>

    </form>

    {#if error && show}
    <div  class="w-3/4 mx-auto mt-4 rounded-full py-1 flex items-center justify-center px-4 bg-red-500 text-sm text-slate-50 font-semibold">
        <p>{message}</p>
    </div>
{/if}
</div>
