import { checkUserAuth } from '$lib/server/check-auth';
import { fail } from '@sveltejs/kit';

import { db } from '$lib/db/db';
import { eq } from 'drizzle-orm';
import { chat } from '$lib/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { error, userId } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	if (!locals.user.id) {
		throw new Error('failed to attach id on login');
	}

	const chats = await db.query.chat.findMany({
		where: eq(chat.userId, userId)
	});

	return {
		chats
	};
};
