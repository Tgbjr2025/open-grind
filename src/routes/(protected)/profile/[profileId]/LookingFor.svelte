<script lang="ts">
	import { UsersThreeIcon } from "phosphor-svelte";
	import {
		lookingForOptions,
		type LookingForOptionId,
	} from "$lib/model/profile";

	let {
		lookingFor,
	}: {
		lookingFor: LookingForOptionId[] | null;
	} = $props();
</script>

{#if lookingFor !== null && lookingFor.length > 0}
	<div class="flex items-center gap-1.5 text-sm">
		<UsersThreeIcon class="shrink-0" />
		<div class="gap-1">
			<span class="text-neutral-500">Looking For</span>
			{lookingFor.map((option) => lookingForOptions[option]).join(", ")}
		</div>
	</div>
{/if}
