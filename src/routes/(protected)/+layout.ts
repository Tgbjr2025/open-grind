import { callMethod } from "$lib/api";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
	console.log("Checking auth state...");
	const profileId = await callMethod("auth_state").catch(console.error);
	console.log("Auth state:", profileId);
	if (profileId === null) {
		return redirect(303, "/auth/sign-in");
	}
};
