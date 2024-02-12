<script lang="ts" >
    import { enhance } from '$app/forms';
    let loading = false

    function submitForm(){
        loading = true

        return async ()=>{
            loading = false
           
        }
    }

</script>


<div class="max-w-sm mx-auto mt-10 bg-slate-950 rounded-md shadow-slate-900 py-4 px-2 " >
    <div class="max-w-md mx-auto h-40" >
        <img  class="w-full  h-full object-contain" alt="login food" src="/food.png" />
    </div>
    <form   method="POST" use:enhance={submitForm} class="w-full flex flex-col items-center gap-y-3" >
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            email
        <input type="email" name="email"  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
        <label class="text-slate-50 font-medium flex flex-col gap-y-1 w-full" >
            password
        <input type="password" name="password"  required class="w-full font-normal border-slate-600 border outline-none rounded-full px-2 bg-inherit py-2"  />
        </label>
     
        <div class="flex gap-x-3 w-full mt-2 " >
    
            <button  disabled={loading} class="disabled:bg-opacity-50 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-full"  formaction="?/signin"  >
            { loading ? "loading..." : "Sign in"}
            </button>
        </div>
        <a  href="/forgot-password" class=" mt-2 ml-auto text-blue-500 hover:underline text-sm font-medium" >forgot password ?</a>
    </form>
</div>
