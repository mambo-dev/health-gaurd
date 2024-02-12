<script>
import "../../app.css"
</script>


<div class="w-full min-h-screen flex flex-col" >
  <nav class="w-full py-3 flex items-center justify-between px-4  border-b border-slate-600" >
    <a href="/" class="text-center text-4xl bg-gradient-to-r from-blue-600 via-green-500 to-blue-800 inline-block text-transparent bg-clip-text "  >HealthGaurd</a>
    <div class="ml-auto w-fit flex items-center gap-x-4" >
      
      <a  class="hover:underline bg-blue-600 text-white font-medium py-2 px-4 rounded-full" href="/signup" >sign up</a>
      <a  class="hover:underline hover:bg-slate-50 hover:text-slate-900 text-white font-medium py-2 px-4 rounded-full" href="/signin" >sign in</a>

    </div>
  </nav>

    <slot />
</div> 