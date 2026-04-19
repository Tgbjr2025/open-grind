<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { UserIcon } from "phosphor-svelte";

	let {
		id,
		displayName,
		age,
		distance,
	}: {
		id: number;
		displayName: string | null;
		age: number | null;
		distance: number | null;
	} = $props();
</script>

<a href="/profile/{id}" class="aspect-square relative flex items-end">
	<div class="absolute w-full h-full bg-stone-700">
		<UserIcon
			weight="fill"
			color="var(--color-stone-400)"
			class="size-3/4 top-1/2 left-1/2 -translate-1/2 absolute"
		/>
	</div>
	<div class="w-full z-1 flex p-0.5 gap-0.5">
		<Badge variant="secondary" class="gap-0">
			{#if displayName !== null}
				<span class="truncate block shrink font-semibold">
					{displayName}
				</span>
			{/if}
			{#if displayName !== null && age !== null}
				,&nbsp;
			{/if}
			{#if age !== null}
				<span class="truncate line-clamp-1 block max-w-full shrink-0">
					{age}
				</span>
			{/if}
		</Badge>
	</div>
</a>
