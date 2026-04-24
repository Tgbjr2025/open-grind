import z from "zod";
import { fetchRest } from ".";

const gendersSchema = z.array(
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

let cachedGenders: z.infer<typeof gendersSchema> | null = null;
export async function fetchGenders() {
	if (cachedGenders) return cachedGenders;
	cachedGenders = await fetchRest("/public/v2/genders")
		.then((data) => data.json())
		.then((data) => gendersSchema.parse(data));
	return cachedGenders;
}
