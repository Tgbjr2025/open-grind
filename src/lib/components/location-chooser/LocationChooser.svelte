<script lang="ts">
	import type { LatLng } from "leaflet";
	import toast from "svelte-french-toast";
	import { MediaQuery } from "svelte/reactivity";
	import NavigationArrowIcon from "phosphor-svelte/lib/NavigationArrowIcon";
	import MagnifyingGlassIcon from "phosphor-svelte/lib/MagnifyingGlassIcon";
	import GpsFixIcon from "phosphor-svelte/lib/GpsFixIcon";
	import * as Empty from "$lib/components/ui/empty";
	import * as Drawer from "$lib/components/ui/drawer/index";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import GeoMapPicker from "./GeoMapPicker.svelte";
	import { encodeGeohash } from "$lib/api/geohash";
	import { setPreferences } from "$lib/app-data/preferences";

	const isDesktop = new MediaQuery("(min-width: 768px)");

	let pinPos: LatLng | undefined = $state();
	let geoMapPickerOpen = $state(false);

	function onsubmit() {
		if (!pinPos) return;
		const geohash = encodeGeohash(pinPos.lat, pinPos.lng);
		setPreferences({ geohash })
			.then(() => {
				geoMapPickerOpen = false;
			})
			.catch((e) => {
				console.error(e);
				toast.error("Failed to save location");
			});
	}
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<NavigationArrowIcon weight="fill" color="var(--primary)" />
		</Empty.Media>
		<Empty.Title>Choose location</Empty.Title>
		<Empty.Description>
			Pick location on the map or select from the list to find nearby profiles.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex gap-2">
			<Button onclick={() => (geoMapPickerOpen = true)}>
				<GpsFixIcon color="currentColor" weight="fill" />
				Pick on map
			</Button>
			<Button
				variant="outline"
				onclick={() => toast.error("Not implemented yet")}
			>
				<MagnifyingGlassIcon color="currentColor" weight="fill" />
				Search
			</Button>
		</div>
	</Empty.Content>
	<!-- <Button variant="link" class="text-muted-foreground" size="sm">
		<a href="#/">
			Learn More <ArrowUpRightIcon class="inline" />
		</a>
	</Button> -->
	{#if isDesktop.current}
		<Dialog.Root bind:open={geoMapPickerOpen}>
			<Dialog.Content
				class="sm:max-w-200 h-[calc(100%-4rem)] flex flex-col"
				preventOverflowTextSelection={false}
				showCloseButton={false}
			>
				<div
					class="h-full touch-manipulation rounded-lg overflow-clip flex-1"
					data-vaul-no-drag
				>
					<GeoMapPicker bind:pinPos />
				</div>
				<Dialog.Footer>
					<Button type="submit" disabled={!pinPos} onclick={onsubmit}>
						Save
					</Button>
					<!-- <Dialog.Close class={buttonVariants({ variant: "outline" })}>
						Cancel
					</Dialog.Close> -->
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<Drawer.Root bind:open={geoMapPickerOpen}>
			<Drawer.Content
				preventOverflowTextSelection={false}
				class="h-full max-h-dvh!"
			>
				<div
					class="h-full touch-manipulation rounded-lg overflow-clip mt-4 mb-2"
					data-vaul-no-drag
				>
					<GeoMapPicker bind:pinPos />
				</div>
				<Drawer.Footer class="pt-2">
					<Button type="submit" disabled={!pinPos} onclick={onsubmit}>
						Save
					</Button>
					<!-- <Drawer.Close class={buttonVariants({ variant: "outline" })}>
						Cancel
					</Drawer.Close> -->
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
</Empty.Root>
