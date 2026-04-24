import z from "zod";

export const sexualPositions = {
	1: "Top",
	2: "Bottom",
	3: "Versatile",
	4: "Vers Bottom",
	5: "Vers Top",
	6: "Side",
};

export const sexualPositionSchema = z.union(
	Object.keys(sexualPositions).map((key) =>
		z.literal(Number(key) as keyof typeof sexualPositions),
	),
);

export type SexualPositionId = keyof typeof sexualPositions;

export const lookingForOptions = {
	2: "Chat",
	3: "Dates",
	4: "Friends",
	5: "Networking",
	6: "Relationship",
	7: "Hookups",
} as const;

export const lookingForOptionSchema = z.union(
	Object.keys(lookingForOptions).map((key) =>
		z.literal(Number(key) as keyof typeof lookingForOptions),
	),
);

export type LookingForOptionId = keyof typeof lookingForOptions;

export const acceptNSFWPicsOptions = {
	1: "Never",
	2: "Not At First",
	3: "Yes Please",
} as const;

export const acceptNSFWPicsOptionSchema = z.union(
	Object.keys(acceptNSFWPicsOptions).map((key) =>
		z.literal(Number(key) as keyof typeof acceptNSFWPicsOptions),
	),
);

export type AcceptNSFWPicsOptionId = keyof typeof acceptNSFWPicsOptions;

export const relationshipStatuses = {
	1: "Single",
	2: "Dating",
	3: "Exclusive",
	4: "Committed",
	5: "Partnered",
	6: "Engaged",
	7: "Married",
	8: "Open Relationship",
} as const;

export const relationshipStatusSchema = z.union(
	Object.keys(relationshipStatuses).map((key) =>
		z.literal(Number(key) as keyof typeof relationshipStatuses),
	),
);

export type RelationshipStatusId = keyof typeof relationshipStatuses;

export const bodyTypes = {
	1: "Toned",
	2: "Average",
	3: "Large",
	4: "Muscular",
	5: "Slim",
	6: "Stocky",
} as const;

export type BodyTypeId = keyof typeof bodyTypes;

export const bodyTypeSchema = z.union(
	Object.keys(bodyTypes).map((key) =>
		z.literal(Number(key) as keyof typeof bodyTypes),
	),
);

export const tribes = {
	1: "Bear",
	2: "Clean-Cut",
	3: "Daddy",
	4: "Discreet",
	5: "Geek",
	6: "Jock",
	7: "Leather",
	8: "Otter",
	9: "Poz",
	10: "Rugged",
	11: "Sober",
	12: "Trans",
	13: "Twink",
} as const;

export const tribeSchema = z.union(
	Object.keys(tribes).map((key) =>
		z.literal(Number(key) as keyof typeof tribes),
	),
);

export type TribeId = keyof typeof tribes;

export const meetAtOptions = {
	1: "My Place",
	2: "Your Place",
	3: "Bar",
	4: "Coffee Shop",
	5: "Restaurant",
} as const;

export const meetAtOptionsSchema = z.union(
	Object.keys(meetAtOptions).map((key) =>
		z.literal(Number(key) as keyof typeof meetAtOptions),
	),
);

export type MeetAtOptionId = keyof typeof meetAtOptions;

export const healthPracticesOptions = {
	1: "Condoms",
	2: "I'm on doxyPEP",
	3: "I'm on PrEP",
	4: "I'm HIV undetectable",
	5: "Prefer to discuss",
} as const;

export const healthPracticesOptionsSchema = z.union(
	Object.keys(healthPracticesOptions).map((key) =>
		z.literal(Number(key) as keyof typeof healthPracticesOptions),
	),
);

export type HealthPracticeOptionId = keyof typeof healthPracticesOptions;
