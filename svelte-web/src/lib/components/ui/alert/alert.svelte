<script lang="ts" module>
  import {type VariantProps, tv} from "tailwind-variants";

  export const alertVariants = tv({
    base: "[&>svg]:text-foreground relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
    variants: {
      variant: {
        default: "bg-background text-foreground",
        fail:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 [&>svg]:text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
</script>

<script lang="ts">
  import type {HTMLAttributes} from "svelte/elements";
  import type {WithElementRef} from "bits-ui";
  import {cn} from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    variant = "default",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: AlertVariant;
  } = $props();
</script>

<div bind:this={ref} class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
 {@render children?.()}
</div>
