<script lang="ts">
	import { ImagesIcon, LockIcon, VideoIcon } from "phosphor-svelte";
	import type { AlbumMessage } from "$lib/model/message";
	import { getMessageContext } from "./context";

	let {
		message,
	}: {
		message: AlbumMessage["body"];
	} = $props();

	const { firstInStack, lastInStack, indexInStack, msgOut } = $derived(
		getMessageContext()(),
	);
</script>

<div
	class={[
		"w-2/5 min-w-35 max-w-60 ms-3 aspect-3/4 h-auto relative rounded-lg",
		{
			"ring ring-accent": message.hasUnseenContent,
			"rounded-es-[6px]": lastInStack && !msgOut,
			"rounded-ee-[6px]": lastInStack && msgOut,
		},
	]}
>
	{#if message.isViewable}
		<img
			src={message.coverUrl}
			alt=""
			class="w-full rounded-[inherit] bg-card-foreground/10 h-full object-cover absolute"
		/>
		<div class="absolute top-0 left-0 size-full @container">
			<div
				class="*:bg-card *:rounded-full *:w-[20cqw] *:aspect-square *:p-2 absolute bottom-1/5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5"
			>
				{#if message.hasPhoto}
					<div>
						<ImagesIcon
							width="100%"
							height="auto"
							weight="fill"
							color="var(--color-neutral-200)"
						/>
					</div>
				{/if}
				{#if message.hasVideo}
					<div>
						<VideoIcon
							width="100%"
							height="auto"
							weight="fill"
							color="var(--color-neutral-200)"
						/>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div
			class="size-full flex justify-center items-center bg-card-foreground/10 rounded-lg"
		>
			<LockIcon weight="fill" size={36} color="var(--color-neutral-600)" />
		</div>
	{/if}
</div>
