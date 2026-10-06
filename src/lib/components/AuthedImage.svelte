<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import type { ClassValue } from "svelte/elements";

	let {
		src,
		alt = "",
		class: className,
		style,
		onerror: externalOnerror,
		...rest
	}: {
		src: string;
		alt?: string;
		class?: ClassValue;
		style?: string;
		onerror?: () => void;
		[key: string]: unknown;
	} = $props();

	let resolvedSrc = $state<string>("");

	$effect(() => {
		const s = src;
		resolvedSrc = "";

		if (!s.startsWith("https://")) {
			resolvedSrc = s;
			return;
		}

		let cancelled = false;

		invoke<string>("fetch_authed_bytes", { url: s })
			.then((dataUrl) => {
				console.log("[AI] got dataUrl len=" + dataUrl.length + " for " + s.slice(-20));
				if (!cancelled) resolvedSrc = dataUrl;
			})
			.catch((err) => {
				console.error("[AI] fetch_authed_bytes failed for " + s.slice(-20) + ": " + err);
				if (!cancelled) externalOnerror?.();
			});

		return () => { cancelled = true; };
	});
</script>

<img src={resolvedSrc} {alt} class={className} {style} {...rest} />
