<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Check } from 'lucide-svelte';
	import type {  PageData } from './$types';


    let loading = false
    let error = false
    let message = ""
    let wakeUpTime = String(new Date().getTime())
    let bedTime =  String(new Date().getTime())
    let notification = false
    let update = false

    export let data:PageData

    if(data.schedule){
        wakeUpTime = data.schedule.wakeUp
        bedTime = data.schedule.bedTime
        update = true
    }



   


   
    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                message = options.result.data.error
            }

            if(options.result.type === "redirect"){
                await goto("/dashboard")
            }
            loading = false
        }
    }

</script>


<div class="max-w-xl mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="w-full  h-fit" >
        <h1  class="text-slate-50 font-medium text-2xl text-center">Did you know sleep is also important for your health. Let's get your sleeping hours </h1>
    </div>
    <form  method="POST" use:enhance={submitForm} class="text-slate-50 mt-4 w-full flex flex-col items-center gap-y-3" >
    <div class="grid grid-cols-2 gap-x-3 gap-y-4 w-full" >
<label>
    Wake up time
    
    <input  type="time" value={wakeUpTime} name="wakeUp" class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-slate-900 py-2" />
</label>
<label>
    BedTime
    <input type="time" value={bedTime} name="bedTime" class="w-full text-slate-50 font-normal border-slate-600 border outline-none rounded-full px-2 bg-slate-900 py-2" />
</label>

<p class="col-span-2" >Do you want to receive notifications ? skip if not. </p>

<label  class="col-span-2"  >
    <button  on:click={()=>{
        notification = !notification

    }} type="button" class="  inline-flex items-center justify-between outline-none hover:cursor-pointer hover:bg-slate-800 focus:bg-slate-900 hover:font-medium  w-full mr-auto py-2 bg-slate-900 px-2 rounded-md" >
       
      
       Receive product updates
       {#if notification }
            <div class="rounded-full w-5 h-5 flex items-center justify-center bg-green-500  " >
                <Check  class="w-4 h-4 font-semibold text-white"  />
            </div>
       {/if}
     
    </button>
    <input type="hidden" value={notification} name="notification" />
</label>
    </div>
     
        <div class="flex gap-x-3 w-full mt-4 " >
            {#if update}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "update schedule"}
                </button>
            {:else}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Save schedule"}
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
