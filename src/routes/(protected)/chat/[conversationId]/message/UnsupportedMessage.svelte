<script lang="ts">
	import { getMessageContext } from "./context";

	let { type }: { type: string } = $props();
</script>

<div
	class="bg-card text-muted-foreground/30 w-full rounded-lg p-2 max-w-full text-center text-sm"
>
	Unsupported message type: {type}
</div>
