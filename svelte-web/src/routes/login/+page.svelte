<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import {Input} from "$lib/components/ui/input";
  import {Button} from "$lib/components/ui/button";
  import {Card} from "$lib/components/ui/card";
  import {Alert, AlertDescription} from "$lib/components/ui/alert";
  import {formSchema, type FormSchema} from "./schema";

  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import {zodClient} from "sveltekit-superforms/adapters";
  import type {Message} from "$lib/models/message";

  let {data}: { data: { form: SuperValidated<Infer<FormSchema>> } } =
    $props();

  const form = superForm<Infer<typeof formSchema>, Message>(data.form, {
    validators: zodClient(formSchema),
    taintedMessage: null,
  });

  const {form: formData, enhance, message, delayed} = form;
</script>

<div class="container mx-auto max-w-md py-10">
 <Card>
  <div class="p-6">
   <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

   <form method="POST" use:enhance class="space-y-6">
    <Form.Field {form} name="username">
     <Form.Control>
      {#snippet children({props})}
       <Form.Label>Username</Form.Label>
       <Input {...props} bind:value={$formData.username}/>
      {/snippet}
     </Form.Control>
     <Form.Description>
      Must start with a letter and can include up to 4 numbers
     </Form.Description>
     <Form.FieldErrors class="text-sm text-red-500"/>
    </Form.Field>

    <Form.Field {form} name="password">
     <Form.Control>
      {#snippet children({props})}
       <Form.Label>Password</Form.Label>
       <Input {...props} type="password" bind:value={$formData.password}/>
      {/snippet}
     </Form.Control>
     <Form.Description>
      Password must be 8-100 characters and include uppercase, lowercase,
      number, and special character
     </Form.Description>
     <Form.FieldErrors class="text-sm text-red-500"/>
    </Form.Field>

    <Button type="submit" class="w-full">
     {#if $delayed}
      Loading...
     {:else}
      Create Account
     {/if}
    </Button>
   </form>

   {#if $message?.message}
    <Alert variant={$message.type_} class="mt-6">
     <AlertDescription>{$message.message}</AlertDescription>
    </Alert>
   {/if}
  </div>
 </Card>
</div>