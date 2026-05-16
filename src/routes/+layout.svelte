<script lang="ts">
	import { IconContext } from "phosphor-svelte";
	import "@fontsource-variable/ibm-plex-sans/wght.css";
	import "@fontsource-variable/ibm-plex-sans/wght-italic.css";

	import "../layout.css";
	import { onMount } from "svelte";
	import { Toaster } from "svelte-french-toast";

	import { applyAndroidInsets } from "$lib/utils";

	onMount(() => applyAndroidInsets());

	import favicon from "$lib/assets/favicon.png";

	let {
		children,
	}: {
		children?: import("svelte").Snippet;
	} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div
	class="fixed inset-x-0 top-0 z-150000 bg-background/50"
	style="height: var(--safe-area-top)"
></div>
<div
	class="fixed inset-x-0 bottom-0 z-150000 bg-background/50"
	style="height: var(--safe-area-bottom)"
></div>
<Toaster
	position="bottom-center"
	toastOptions={{
		style: "background-color: var(--accent); color: var(--popover)",
	}}
/>
<!-- TODO: migrate to svelte-sonner (svelte-french-toast is dead) -->
<IconContext values={{}}>
	{@render children?.()}
</IconContext>
