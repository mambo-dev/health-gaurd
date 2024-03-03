import { db } from '$lib/db/db';
import { checkUserAuth } from '$lib/server/check-auth';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { profile } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { userId, error } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	const findProfile = await db.query.profile.findFirst({
		where: eq(profile.userId, userId)
	});

	return {
		user: findProfile
	};
};
