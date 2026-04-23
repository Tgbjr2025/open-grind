<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Sheet from "$lib/components/ui/sheet";
	import { buttonVariants } from "$lib/components/ui/button";
	import { SlidersHorizontalIcon } from "phosphor-svelte";
	import FilterBoolean from "$lib/components/filters/FilterBoolean.svelte";
	import PositionFilter from "$lib/components/filters/PositionFilter.svelte";
	import PhotosFilter from "$lib/components/filters/PhotosFilter.svelte";
	import AgeFilter from "$lib/components/filters/AgeFilter.svelte";
	import GendersFilter from "$lib/components/filters/GendersFilter.svelte";
	import TribesFilter from "$lib/components/filters/TribesFilter.svelte";
	import type {
		AcceptNSFWPicsOptionId,
		BodyTypeId,
		HealthPracticeOptionId,
		LookingForOptionId,
		MeetAtOptionId,
		RelationshipStatusId,
		TribeId,
	} from "$lib/api/profile";
	import BodyTypeFilter from "$lib/components/filters/BodyTypeFilter.svelte";
	import RelationshipStatusFilter from "$lib/components/filters/RelationshipStatusFilter.svelte";
	import AcceptNSFWPicsFilter from "$lib/components/filters/AcceptNSFWPicsFilter.svelte";
	import LookingForFilter from "$lib/components/filters/LookingForFilter.svelte";
	import MeetAtFilter from "$lib/components/filters/MeetAtFilter.svelte";
	import HealthPracticesFilter from "$lib/components/filters/HealthPracticesFilter.svelte";

	let open = $state(true);

	let filterIsFavorite = $state(false);
	let filterIsOnline = $state(false);
	let filterIsRightNow = $state(false);

	let filterAgeEnabled = $state(false);
	let filterAge = $state([18, 102]);

	let filterGenderEnabled = $state(false);
	let filterGenders: number[] = $state([]);

	let filterPositionEnabled = $state(false);
	let filterPositions: string[] = $state([]);

	let filterPhotosEnabled = $state(false);
	let filterPhotos: string[] = $state([]);

	let filterTribesEnabled = $state(false);
	let filterTribes: TribeId[] = $state([]);

	let filterBodyTypesEnabled = $state(false);
	let filterBodyTypes: BodyTypeId[] = $state([]);

	let filterRelationshipStatusesEnabled = $state(false);
	let filterRelationshipStatuses: RelationshipStatusId[] = $state([]);

	let filterAcceptNSFWPicsEnabled = $state(false);
	let filterAcceptNSFWPics: AcceptNSFWPicsOptionId[] = $state([]);

	let filterLookingForEnabled = $state(false);
	let filterLookingFor: LookingForOptionId[] = $state([]);

	let filterMeetAtEnabled = $state(false);
	let filterMeetAt: MeetAtOptionId[] = $state([]);

	let filterHaventChattedTodayEnabled = $state(false);

	let filterHealthPracticesEnabled = $state(false);
	let filterHealthPractices: HealthPracticeOptionId[] = $state([]);

	let contentScroll = $state(0);
</script>

<div class="flex w-full">
	<Sheet.Root bind:open>
		<Sheet.Trigger class={buttonVariants({ variant: "secondary" })}>
			<SlidersHorizontalIcon />
		</Sheet.Trigger>
		<Sheet.Content
			side="bottom"
			showCloseButton={false}
			preventOverflowTextSelection={false}
			class="max-h-dvh"
		>
			<Sheet.Header
				class={[
					"p-4 border border-x-0 border-t-0 border-transparent transition-colors",
					{
						"border-muted": contentScroll > 0,
					},
				]}
			>
				<Sheet.Title>Filters</Sheet.Title>
			</Sheet.Header>
			<div
				class="md:columns-2 lg:columns-3 flex-wrap space-y-4 flex-1 px-4 w-full **:break-inside-avoid overflow-auto max-h-full min-h-0 shrink py-1"
				onscroll={(e) => {
					if (e.target instanceof HTMLDivElement) {
						contentScroll =
							e.target.scrollTop /
							(e.target.scrollHeight - e.target.clientHeight);
					}
				}}
			>
				<FilterBoolean id="favorite" bind:checked={filterIsFavorite}>
					Favorites
				</FilterBoolean>
				<FilterBoolean id="online" bind:checked={filterIsOnline}>
					Online
				</FilterBoolean>
				<FilterBoolean id="right-now" bind:checked={filterIsRightNow}>
					Right now
				</FilterBoolean>
				<AgeFilter bind:checked={filterAgeEnabled} bind:value={filterAge} />
				<GendersFilter
					bind:checked={filterGenderEnabled}
					bind:value={filterGenders}
				/>
				<PositionFilter
					bind:checked={filterPositionEnabled}
					bind:value={filterPositions}
				/>
				<PhotosFilter
					bind:checked={filterPhotosEnabled}
					bind:value={filterPhotos}
				/>
				<TribesFilter
					bind:checked={filterTribesEnabled}
					bind:value={filterTribes}
				/>
				<BodyTypeFilter
					bind:checked={filterBodyTypesEnabled}
					bind:value={filterBodyTypes}
				/>
				<!-- TODO: height -->
				<!-- TODO: weight -->
				<RelationshipStatusFilter
					bind:checked={filterRelationshipStatusesEnabled}
					bind:value={filterRelationshipStatuses}
				/>
				<AcceptNSFWPicsFilter
					bind:checked={filterAcceptNSFWPicsEnabled}
					bind:value={filterAcceptNSFWPics}
				/>
				<LookingForFilter
					bind:checked={filterLookingForEnabled}
					bind:value={filterLookingFor}
				/>
				<MeetAtFilter
					bind:checked={filterMeetAtEnabled}
					bind:value={filterMeetAt}
				/>
				<FilterBoolean
					id="havent-chatted-today"
					bind:checked={filterHaventChattedTodayEnabled}
				>
					Haven't chatted today
				</FilterBoolean>
				<HealthPracticesFilter
					bind:checked={filterHealthPracticesEnabled}
					bind:value={filterHealthPractices}
				/>
			</div>
			<Sheet.Footer
				class={[
					"p-4 sm:items-end border border-x-0 border-b-0 border-transparent transition-colors",
					{
						"border-muted": contentScroll < 1,
					},
				]}
			>
				<Button type="submit">Apply</Button>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</div>
