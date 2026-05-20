<script lang="ts">
	import {
		getDistanceUnit,
		setDistanceUnit,
	} from "$lib/app-data/distance-unit.svelte";
	import * as Item from "$lib/components/ui/item";
</script>

<Item.Root variant="outline">
	<Item.Content class="max-xxxxs:min-w-0">
		<Item.Title>Distance unit</Item.Title>
		<Item.Description>Choose how distances are displayed.</Item.Description>
	</Item.Content>
	<Item.Actions>
		<div class="flex rounded-lg overflow-hidden border border-border text-sm font-medium">
			<button
				type="button"
				class={[
					"px-3 py-1.5 transition-colors",
					getDistanceUnit() === "km"
						? "bg-primary text-primary-foreground"
						: "bg-transparent text-muted-foreground hover:bg-muted",
				]}
				onclick={() => setDistanceUnit("km")}
			>
				km
			</button>
			<button
				type="button"
				class={[
					"px-3 py-1.5 transition-colors",
					getDistanceUnit() === "mi"
						? "bg-primary text-primary-foreground"
						: "bg-transparent text-muted-foreground hover:bg-muted",
				]}
				onclick={() => setDistanceUnit("mi")}
			>
				mi
			</button>
		</div>
	</Item.Actions>
</Item.Root>
