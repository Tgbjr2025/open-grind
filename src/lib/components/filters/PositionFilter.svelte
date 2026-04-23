<script lang="ts">
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import FilterBoolean from "./FilterBoolean.svelte";
	import {
		ArrowDownIcon,
		ArrowDownRightIcon,
		ArrowsDownUpIcon,
		ArrowsLeftRightIcon,
		ArrowUpIcon,
		ArrowUpRightIcon,
		XIcon,
	} from "phosphor-svelte";

	let {
		checked = $bindable(),
		value = $bindable(),
	}: {
		checked: boolean;
		value: string[];
	} = $props();
</script>

<div class="flex flex-col gap-2 min-w-0">
	<FilterBoolean id="position" bind:checked>Position</FilterBoolean>
	<div class="ps-6">
		<ToggleGroup.Root
			type="multiple"
			variant="outline"
			spacing={2}
			class="flex-wrap w-full gap-1"
			bind:value
		>
			<ToggleGroup.Item value="top">
				<ArrowUpIcon />
				Top
			</ToggleGroup.Item>
			<ToggleGroup.Item value="vers-top">
				<ArrowUpRightIcon />
				Vers Top
			</ToggleGroup.Item>
			<ToggleGroup.Item value="vers">
				<ArrowsDownUpIcon />
				Versatile
			</ToggleGroup.Item>
			<ToggleGroup.Item value="vers-bottom">
				<ArrowDownRightIcon />
				Vers Bottom
			</ToggleGroup.Item>
			<ToggleGroup.Item value="bottom">
				<ArrowDownIcon />
				Bottom
			</ToggleGroup.Item>
			<ToggleGroup.Item value="side">
				<ArrowsLeftRightIcon />
				Side
			</ToggleGroup.Item>
			<ToggleGroup.Item value="not-specified">
				<XIcon />
				Not Specified
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>
</div>
