import {
	acceptNSFWPicsOptionSchema,
	bodyTypeSchema,
	healthPracticesOptionsSchema,
	lookingForOptionSchema,
	meetAtOptionsSchema,
	relationshipStatusSchema,
	tribeSchema,
} from "$lib/model/profile";
import z from "zod";

export const filterIsFavoriteSchema = z.boolean();
export const filterIsOnlineSchema = z.boolean();
export const filterIsRightNowSchema = z.boolean();

export const filterAgeEnabledSchema = z.boolean();
export const filterAgeSchema = z.array(z.number().min(18).max(102)).length(2);

export const filterGenderEnabledSchema = z.boolean();
export const filterGendersSchema = z.array(z.number().int().nonnegative());

export const filterPositionEnabledSchema = z.boolean();
export const filterPositionsSchema = z.array(
	z.union([
		z.literal("top"),
		z.literal("vers-top"),
		z.literal("versatile"),
		z.literal("vers-bottom"),
		z.literal("bottom"),
		z.literal("side"),
		z.literal("not-specified"),
	]),
);

export const filterPhotosEnabledSchema = z.boolean();
export const filterPhotosSchema = z.array(
	z.enum(["has-photos", "has-face-pics", "has-albums"]),
);

export const filterTribesEnabledSchema = z.boolean();
export const filterTribesSchema = z.array(tribeSchema);

export const filterBodyTypesEnabledSchema = z.boolean();
export const filterBodyTypesSchema = z.array(bodyTypeSchema);

export const filterHeightEnabledSchema = z.boolean();
export const filterHeightSchema = z
	.array(z.number().min(120).max(242))
	.length(2);

export const filterWeightEnabledSchema = z.boolean();
export const filterWeightSchema = z
	.array(z.number().min(40).max(273))
	.length(2);

export const filterRelationshipStatusesEnabledSchema = z.boolean();
export const filterRelationshipStatusesSchema = z.array(
	relationshipStatusSchema,
);

export const filterAcceptNSFWPicsEnabledSchema = z.boolean();
export const filterAcceptNSFWPicsSchema = z.array(acceptNSFWPicsOptionSchema);

export const filterLookingForEnabledSchema = z.boolean();
export const filterLookingForSchema = z.array(lookingForOptionSchema);

export const filterMeetAtEnabledSchema = z.boolean();
export const filterMeetAtSchema = z.array(meetAtOptionsSchema);

export const filterHaventChattedTodayEnabledSchema = z.boolean();

export const filterHealthPracticesEnabledSchema = z.boolean();
export const filterHealthPracticesSchema = z.array(
	healthPracticesOptionsSchema,
);

export const gridSearchFiltersSchema = z.object({
	isFavorite: filterIsFavoriteSchema,
	isOnline: filterIsOnlineSchema,
	isRightNow: filterIsRightNowSchema,

	ageEnabled: filterAgeEnabledSchema,
	age: filterAgeSchema,

	genderEnabled: filterGenderEnabledSchema,
	genders: filterGendersSchema,

	positionEnabled: filterPositionEnabledSchema,
	positions: filterPositionsSchema,

	photosEnabled: filterPhotosEnabledSchema,
	photos: filterPhotosSchema,

	tribesEnabled: filterTribesEnabledSchema,
	tribes: filterTribesSchema,

	bodyTypesEnabled: filterBodyTypesEnabledSchema,
	bodyTypes: filterBodyTypesSchema,

	heightEnabled: filterHeightEnabledSchema,
	height: filterHeightSchema,

	weightEnabled: filterWeightEnabledSchema,
	weight: filterWeightSchema,

	relationshipStatusesEnabled: filterRelationshipStatusesEnabledSchema,
	relationshipStatuses: filterRelationshipStatusesSchema,

	acceptNSFWPicsEnabled: filterAcceptNSFWPicsEnabledSchema,
	acceptNSFWPics: filterAcceptNSFWPicsSchema,

	lookingForEnabled: filterLookingForEnabledSchema,
	lookingFor: filterLookingForSchema,

	meetAtEnabled: filterMeetAtEnabledSchema,
	meetAt: filterMeetAtSchema,

	haventChattedTodayEnabled: filterHaventChattedTodayEnabledSchema,

	healthPracticesEnabled: filterHealthPracticesEnabledSchema,
	healthPractices: filterHealthPracticesSchema,
});

export type GridSearchFilters = z.infer<typeof gridSearchFiltersSchema>;
