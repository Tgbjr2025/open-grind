<script lang="ts">
	import type { TransitionConfig } from "svelte/transition";
	import FilterBoolean from "./FilterBoolean.svelte";
	import { CaretDownIcon } from "phosphor-svelte";
	import { expoOut } from "svelte/easing";

	let {
		checked = $bindable(),
		id,
		label,
		children,
	}: {
		checked: boolean;
		id: string;
		label: string;
		children?: import("svelte").Snippet;
	} = $props();

	let expanded = $state(false);

	const hide = (node: HTMLDivElement): TransitionConfig => {
		const height = node.offsetHeight;
		return {
			duration: 400,
			css: (t: number) => `height: calc(${t} * ${height}px); opacity: ${t};`,
			easing: expoOut,
		};
	};
</script>

<div class="flex flex-col min-w-0">
	<FilterBoolean
		{id}
		bind:checked={
			() => checked,
			(v) => {
				if (expanded && !checked) {
					expanded = false;
				} else {
					expanded = v;
					checked = v;
				}
			}
		}
	>
		{label}
		<CaretDownIcon
			class={["transition-transform", { "-rotate-180": expanded }]}
		/>
	</FilterBoolean>
	{#if expanded}
		<div class="ps-6 pt-2 overflow-clip" transition:hide>
			{@render children?.()}
		</div>
	{/if}
</div>
