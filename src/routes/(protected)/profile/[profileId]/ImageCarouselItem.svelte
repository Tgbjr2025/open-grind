<script lang="ts">
	import { expoOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	let focused = $state(false);

	$effect(() => {
		const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		if (focused) {
			document.documentElement.classList.add(`scroll-lock-${id}`);
			return () => {
				document.documentElement.classList.remove(`scroll-lock-${id}`);
			};
		} else {
			document.documentElement.classList.remove(`scroll-lock-${id}`);
		}
	});
</script>

<button onclick={() => (focused = !focused)} class="item">
	<img
		src="https://placehold.co/600x400"
		alt=""
		draggable="false"
		class={{
			focused: focused,
			unfocused: !focused,
		}}
	/>
</button>
{#if focused}
	<div
		class="bg-black/50 fixed top-0 left-0 size-full z-99"
		transition:fade={{ duration: 500, easing: expoOut }}
	></div>
{/if}

<style lang="postcss">
	@reference "$layout";
	.item {
		@apply w-full h-full aspect-[inherit] relative block;
		scroll-snap-stop: always;
	}

	.item img {
		@apply w-full h-full aspect-[inherit] z-100;
		transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.item img.unfocused {
		@apply absolute top-0 left-0 object-cover;
	}

	.item img.focused {
		@apply fixed top-1/2 left-1/2 object-contain -translate-1/2;
	}
</style>
