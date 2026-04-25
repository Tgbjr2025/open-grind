<script lang="ts">
	import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";

	let {
		onlineUntil,
		seen,
	}: {
		onlineUntil: number | null;
		seen: number | null;
	} = $props();
</script>

{#if onlineUntil !== null && onlineUntil > Date.now()}
	<span>
		<span class="bg-green-600 rounded-full size-1 inline-block"></span>
		Online now
	</span>
{:else if seen !== null}
	<span class="text-gray-500">
		Online {formatDistanceToNowStrict(seen, {
			addSuffix: true,
		})}
	</span>
{:else}
	<span class="text-gray-500">Offline</span>
{/if}
