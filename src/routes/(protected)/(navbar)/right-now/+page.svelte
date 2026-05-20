<script lang="ts">
	import { LightningIcon, UserIcon } from "phosphor-svelte";

	import { getPreferences } from "$lib/app-data/preferences.svelte";
	import * as Empty from "$lib/components/ui/empty";
	import { Spinner } from "$lib/components/ui/spinner";
	import { getGrid, profileCache } from "../(root)/grid";

	const feed = getPreferences().then(({ geohash }) => {
		if (!geohash) throw new Error("Location not set — open Browse first.");
		return getGrid({ nearbyGeoHash: geohash, rightNow: true, onlineOnly: true });
	});
</script>

<div class="px-4 flex-1 flex flex-col">
	{#await feed}
		<div class="flex flex-1 items-center justify-center">
			<Spinner class="size-6" />
		</div>
	{:then { items }}
		{@const profiles = items.filter((i) => i.type === "full")}
		{#if profiles.length === 0}
			<Empty.Root>
				<Empty.Header>
					<Empty.Media variant="icon">
						<LightningIcon weight="fill" />
					</Empty.Media>
					<Empty.Title>Nobody right now</Empty.Title>
					<Empty.Description>Check back soon — people post when they're available.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		{:else}
			<ul class="flex flex-col py-2">
				{#each profiles as item (item.id)}
					{@const cached = profileCache.get(item.id)}
					{@const imageHash = cached?.imageHash ?? item.profilePhotosHashes?.[0] ?? null}
					{@const name = cached?.displayName ?? item.displayName ?? "Anonymous"}
					<li>
						<a
							href="/profile/{item.id}"
							class="flex items-center gap-3 hover:bg-muted/60 active:bg-muted transition-colors rounded-2xl px-3 py-2.5"
						>
							<div class="size-14 rounded-2xl bg-muted shrink-0 overflow-hidden flex items-center justify-center">
								{#if imageHash}
									<img
										src="https://cdns.grindr.com/images/thumb/320x320/{imageHash}"
										alt="{name}'s profile"
										class="w-full h-full object-cover"
										loading="lazy"
										draggable="false"
									/>
								{:else}
									<UserIcon weight="fill" color="var(--color-stone-400)" class="size-8" />
								{/if}
							</div>
							<div class="flex flex-col gap-0.5 min-w-0 flex-1">
								<span class="font-semibold truncate">{name}</span>
								{#if item.distance !== null}
									<span class="text-xs text-muted-foreground/70">
										{item.distance < 1000
											? `${Math.round(item.distance)} m away`
											: `${(item.distance / 1000).toFixed(1)} km away`}
									</span>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{:catch error}
		<div class="flex flex-1 items-center justify-center">
			<p class="text-destructive text-sm font-medium">
				{error instanceof Error ? error.message : "Failed to load Right Now feed."}
			</p>
		</div>
	{/await}
</div>
