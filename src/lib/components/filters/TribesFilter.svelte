<script lang="ts">
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import FilterDropdown from "$lib/components/filters/FilterDropdown.svelte";

	let {
		checked = $bindable(),
		value = $bindable(),
	}: {
		checked: boolean;
		value: number[];
	} = $props();
</script>

<div class="flex flex-col min-w-0">
	<FilterDropdown id="tribes" label="Tribes" bind:checked>
		<ToggleGroup.Root
			type="multiple"
			variant="outline"
			spacing={2}
			class="flex-wrap w-full gap-1"
			bind:value={
				() => value.map(String),
				(v) => ((checked = v.length > 0), (value = v.map(Number)))
			}
		>
			<ToggleGroup.Item value="1">Bear</ToggleGroup.Item>
			<ToggleGroup.Item value="2">Clean-Cut</ToggleGroup.Item>
			<ToggleGroup.Item value="3">Daddy</ToggleGroup.Item>
			<ToggleGroup.Item value="4">Discreet</ToggleGroup.Item>
			<ToggleGroup.Item value="5">Geek</ToggleGroup.Item>
			<ToggleGroup.Item value="6">Jock</ToggleGroup.Item>
			<ToggleGroup.Item value="7">Leather</ToggleGroup.Item>
			<ToggleGroup.Item value="8">Otter</ToggleGroup.Item>
			<ToggleGroup.Item value="9">Poz</ToggleGroup.Item>
			<ToggleGroup.Item value="10">Rugged</ToggleGroup.Item>
			<ToggleGroup.Item value="11">Sober</ToggleGroup.Item>
			<ToggleGroup.Item value="12">Trans</ToggleGroup.Item>
			<ToggleGroup.Item value="13">Twink</ToggleGroup.Item>
		</ToggleGroup.Root>
	</FilterDropdown>
</div>
