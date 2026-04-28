<script lang="ts">
	import ImageCarouselItem from "./ImageCarouselItem.svelte";
</script>

<div
	class="w-full flex flex-col h-auto aspect-3/4 snap-y snap-mandatory *:snap-center overflow-auto carousel"
>
	<ImageCarouselItem />
	<ImageCarouselItem />
	<ImageCarouselItem />
</div>

<style lang="postcss">
	@reference "$layout";
	.carousel::-webkit-scrollbar {
		display: none;
	}
</style>
