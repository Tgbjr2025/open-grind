<script lang="ts">
	import type z from "zod";
	import { onMount } from "svelte";
	import { searchProfiles, type searchProfileSchema } from "./grid";
	import { getPreferences } from "$lib/app-data/preferences.svelte";
	import ProfileMiniCard from "./ProfileMiniCard.svelte";

	let {
		geohash,
	}: {
		geohash: string;
	} = $props();

	// <button
	// 	onclick={async () => {
	// 		const profile = await fetchRest("/v7/profiles/22323233");
	// 		console.log(await profile?.json());
	// 	}}>Fetch profile</button
	// >
	// <button
	// 	onclick={async () => {
	// 		await callMethod("logout");
	// 		goto("/auth/sign-in");
	// 	}}>Log out</button
	// >

	let profiles = $state(fetchProfiles());

	async function fetchProfiles() {
		try {
			return await searchProfiles({
				nearbyGeoHash: geohash,
			});
		} catch (e) {
			console.error(e);
			throw new Error("Failed to fetch profiles");
		}
	}
</script>

<div class="grid grid-cols-3 w-full gap-0.5 px-1">
	{#await profiles}
		Loading
	{:then { profiles }}
		{#each profiles as { displayName, age, distance, profileId } (profileId)}
			<ProfileMiniCard id={profileId} {displayName} {age} {distance} />
		{/each}
	{/await}
</div>
