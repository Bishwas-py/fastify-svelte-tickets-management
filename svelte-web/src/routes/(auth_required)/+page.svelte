<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";

  let {data} = $props();
</script>

<div class="px-4 pt-5">

 <Alert.Root>
  <Alert.Title>What's up, <strong>@{data.user.username}</strong>!</Alert.Title>
  <Alert.Description
  >Welcome to the ultimate mongo, svelte & fastify web dash!
  </Alert.Description
  >
 </Alert.Root>
</div>