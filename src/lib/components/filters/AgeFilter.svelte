<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import { Slider } from "$lib/components/ui/slider";
	import FilterField from "./FilterField.svelte";

	let {
		checked = $bindable(),
		value = $bindable(),
	}: { checked: boolean; value: number[] } = $props();
</script>

<div class="inline-block space-y-3 w-full">
	<FilterField>
		<Checkbox id="filters-age" bind:checked />
		<Label for="filters-age">Age</Label>
		<span class="ml-auto min-w-0 truncate">
			{#if value[1] === 102}
				{value[0]} years & over
			{:else}
				{value[0]} - {value[1]}
			{/if}
		</span>
	</FilterField>
	<div class="ps-7">
		<Slider
			type="multiple"
			bind:value={
				() => value,
				(v) => {
					checked = true;
					value = v;
				}
			}
			min={18}
			max={102}
			step={1}
			class=""	
		/>
	</div>
</div>
