
<script lang="ts" >
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';



    let loading = false
    let error = false
    let message = ""
    
    
    function submitForm(){
        loading = true

        return async (options:any)=>{
            if(options.result.type === "failure"){
                error = true 
                message = options.result.data.error
            }

            if(options.result.type === "redirect"){
                await goto(options.result.location)
            }
            loading = false
        }
    }

</script>


<div class="max-w-sm mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="max-w-md mx-auto h-40" >
        <img  class="w-full  h-full object-contain" alt="login food" src="/food.png" />
    </div>
    <form  method="POST" use:enhance={submitForm} class="w-full flex flex-col items-center gap-y-3" >
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            email
        <input type="email" name="email"  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            password
        <input type="password" name="password"  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            Confirm password
        <input type="password" name="confirmPassword"  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <div class="flex gap-x-3 w-full mt-2 " >
            <button formaction="?/signup"  disabled={loading}  class=" disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"  type="submit" >
            {loading  ? "loading..." : "Sign up"}
            </button>
        </div>
        <a  href="/signin" class=" mt-2 mr-auto text-blue-500 hover:underline text-sm font-medium" >Already have an account? sign in.</a>

    </form>

    {#if error}
    <div  class="w-full mt-2 rounded-full py-1 flex items-center justify-center px-4 bg-red-500 text-sm text-slate-50 font-semibold">
        <p>{message}</p>
    </div>
{/if}
</div>
