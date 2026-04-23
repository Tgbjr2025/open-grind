<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import FilterField from "./FilterField.svelte";

	let {
		id,
		checked = $bindable(),
		children,
	}: {
		id: string;
		checked: boolean;
		children?: import("svelte").Snippet;
	} = $props();
</script>

<FilterField>
	<Checkbox id="filters-{id}" bind:checked />
	<Label for="filters-{id}">{@render children?.()}</Label>
</FilterField>
