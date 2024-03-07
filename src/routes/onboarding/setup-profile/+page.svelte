<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DropDown from '$lib/components/DropDown.svelte';
	import type { Profile } from '$lib/db/schema';
	import type { PageData } from './$types';
    export let data:PageData


    let loading = false
    let error = false
    let message = ""
    let activity_level = {
        sedentary:"sedentary",
        lightly_active:"Lightly active",
        moderately_active:"Moderately active",
        active:"Active",
        very_active:"Very active",
    }
    let activityValue:string = "";
    let genderValue:string = ""
    let update = false
    let firstName = ""
    let secondName = ""
    let age = 0
    let height= 0
    let weight= 0

    
    if(data && data.profile){
        update = true
        
        activityValue = String(data.profile.activityLevel)
        genderValue = String(data.profile.sex)
        firstName = data.profile.firstName
        secondName = data.profile.secondName
        age = data.profile.age
        height = data.profile.height
        weight = data.profile.weight
    }


   
    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                message = options.result.data.error
            }

            if(options.result.type === "redirect"){
                await goto("/onboarding/select-goals")
            }
            loading = false
        }
    }

</script>


<div class="max-w-xl mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="w-full  h-fit" >
        <h1  class="text-slate-50 font-medium text-2xl text-center">This information will help us calculate your BMI, BMR and AMR giving you better recommendations. </h1>
    </div>
    <form  method="POST" use:enhance={submitForm} class="mt-4 w-full flex flex-col items-center gap-y-3" >
    <div class="grid grid-cols-3 gap-x-3 gap-y-4 w-full" >
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            First name
        <input type="text" name="firstName" value={firstName}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Second name
        <input type="text" name="secondName" value={secondName}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Age
        <input type="number" name="age" value={age}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Height (cm)
        <input type="number" name="height" value={height}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Weight (kg)
        <input type="number" name="weight" value={weight}  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
             
        <div class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Sex 
            <DropDown label={genderValue.length > 0 ? genderValue : "Choose sex" } bind:value={genderValue} 
            buttonClassName=" text-sm  inline-flex items-center justify-between px-4 w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"
              options={["male", "female"]} />
              <input type="hidden" value={genderValue} name="gender" />
        </div>
        
        <div class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Activity level
            <DropDown label={activityValue.length > 0 ? activityValue : "Choose level" } bind:value={activityValue} 
            buttonClassName="text-sm inline-flex items-center justify-between px-4 w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"
              options={Object.entries(activity_level).map((value)=>{
                return value[1]
            })} />
            <input type="hidden" value={activityValue} name="activityLevel" />
        </div>
    </div>
     
        <div class="flex gap-x-3 w-3/4 mt-4 " >
            {#if update}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Update profile"}
                </button>
            {:else}
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"    >
                { loading ? "loading..." : "Save profile"}
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
