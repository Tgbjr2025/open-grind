<script lang="ts">
	import { tribes, type TribeId } from "$lib/model/profile";
	import FilterSimpleArray from "./FilterSimpleArray.svelte";

	let {
		checked = $bindable(),
		value = $bindable(),
	}: { checked: boolean; value: TribeId[] } = $props();
</script>

<FilterSimpleArray
	bind:checked
	bind:value
	id="tribes"
	label="Tribes"
	items={Object.entries(tribes).map(([value, label]) => ({
		value: Number(value),
		label,
	}))}
	convert={Number}
/>
