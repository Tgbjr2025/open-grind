<script lang="ts">
	import { openUrl } from "@tauri-apps/plugin-opener";

	let {
		onclick,
		children,
		href,
		...props
	}: import("svelte/elements").SvelteHTMLElements["a"] = $props();
</script>

<a
	{href}
	onclick={(event) => {
		onclick?.(event);
		if (href) {
			event.preventDefault();
			void openUrl(href);
		}
	}}
	{...props}
>
	{@render children?.()}
</a>
