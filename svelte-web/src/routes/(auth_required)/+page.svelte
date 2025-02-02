<script lang="ts">
  let {data} = $props();
</script>
<h1>Welcome to SvelteKit, @{data.user.username}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>


<form action="/logout" method="POST" class="ml-auto text-sm flex justify-center items-center px-1 h-6 sm:px-2 sm:h-8
                     bg-neutral-100 dark:bg-neutral-800 font-normal whitespace-nowrap
                        text-neutral-700 dark:text-white dark:outline-0 outline outline-1 outline-indigo-900
                        shadow focus:ring focus:outline-none rounded-lg mr-4">
 <button type="submit">
  Logout
 </button>
</form>