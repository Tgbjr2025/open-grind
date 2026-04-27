<script lang="ts">
	import { UsersThreeIcon } from "phosphor-svelte";
	import { meetAtOptions, type MeetAtOptionId } from "$lib/model/profile";

	let {
		meetAt,
	}: {
		meetAt: MeetAtOptionId[] | null;
	} = $props();
</script>

{#if meetAt !== null && meetAt.length > 0}
	<div class="flex items-center gap-1.5 text-sm">
		<UsersThreeIcon class="shrink-0" />
		<div class="gap-1">
			<span class="text-neutral-500">Meet At</span>
			{meetAt.map((option) => meetAtOptions[option]).join(", ")}
		</div>
	</div>
{/if}
