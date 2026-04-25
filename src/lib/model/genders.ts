import z from "zod";

export const gendersSchema = z.array(
	z.object({
		genderId: z.number().int().nonnegative(),
		gender: z.string().min(1),
		genderPlural: z.string().min(1),
		displayGroup: z.number().int().nonnegative(),
		sortProfile: z.number().int().nonnegative().nullable(),
		sortFilter: z.number().int().nonnegative().nullable(),
		excludeOnProfileSelection: z
			.array(z.number().int().nonnegative())
			.nullable(),
		excludeOnFilterSelection: z
			.array(z.number().int().nonnegative())
			.nullable(),
		alsoClassifiedAs: z.array(z.number().int().nonnegative()),
	}),
);
