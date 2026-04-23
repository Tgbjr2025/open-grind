<script lang="ts">
	import { healthPracticesOptions } from "$lib/api/profile";
	import FilterSimpleArray from "./FilterSimpleArray.svelte";

	let {
		checked = $bindable(),
		value = $bindable(),
	}: { checked: boolean; value: number[] } = $props();
</script>

<FilterSimpleArray
	bind:checked
	bind:value
	id="health-practices"
	label="Health Practices"
	items={Object.entries(healthPracticesOptions).map(([value, label]) => ({
		value: Number(value),
		label,
	}))}
	convert={Number}
/>
