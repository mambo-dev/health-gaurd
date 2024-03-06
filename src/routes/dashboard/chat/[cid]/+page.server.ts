import { checkUserAuth } from '$lib/server/check-auth';
import { fail } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { uid } from 'uid';
import { db } from '$lib/db/db';
import { chat } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	createChat: async ({ locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const uniqueId = uid(25);
		await db.insert(chat).values({
			userId,
			displayId: uniqueId
		});

		const allChats = await db.query.chat.findMany({
			where: eq(chat.userId, userId)
		});

		return {
			allChats
		};
	}
};
