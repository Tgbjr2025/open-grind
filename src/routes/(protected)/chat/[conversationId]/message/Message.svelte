<script lang="ts">
	import type { Message } from "$lib/model/message";
	import AlbumMessage from "./AlbumMessage.svelte";
	import ImageMessage from "./ImageMessage.svelte";
	import TextMessage from "./TextMessage.svelte";
	import MessageDateGroup from "./MessageDateGroup.svelte";
	import UnsupportedMessage from "./UnsupportedMessage.svelte";
	import MessageTime from "./MessageTime.svelte";
	import { setMessageContext } from "./context";

	let {
		message,
		ourProfileId,
		indexInStack,
		stackLength,
		dayStart,
	}: {
		message: Message;
		ourProfileId: number;
		indexInStack: number;
		stackLength: number;
		dayStart?: number;
	} = $props();

	const msgOut = $derived(message.senderId === ourProfileId);
	const firstInStack = $derived(indexInStack === 0);
	const lastInStack = $derived(indexInStack === stackLength - 1);

	setMessageContext(() => ({
		firstInStack,
		lastInStack,
		indexInStack,
		msgOut,
		timestamp: message.timestamp,
	}));
</script>

<div
	class={[
		"flex flex-col gap-0.5",
		{
			"mt-3": firstInStack,
		},
	]}
>
	{#if firstInStack && dayStart !== undefined}
		<MessageDateGroup {dayStart} />
	{/if}
	{#if message.type === "Text"}
		<TextMessage message={message.body} />
	{:else if message.type === "Image" || message.type === "ExpiringImage"}
		<ImageMessage message={message.body} />
	{:else if message.type === "Album" || message.type === "ExpiringAlbum" || message.type === "ExpiringAlbumV2"}
		<AlbumMessage message={message.body} />
	{:else}
		<UnsupportedMessage type={message.type} />
	{/if}
	{#if lastInStack}
		<MessageTime />
	{/if}
</div>
