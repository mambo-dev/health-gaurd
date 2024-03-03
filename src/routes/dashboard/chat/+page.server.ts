import { db } from '$lib/db/db';
import { chat } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { uid } from 'uid';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
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

export const actions: Actions = {
	default: async ({ locals }) => {
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

		const findChat = await db.query.chat.findFirst({
			where: eq(chat.displayId, uniqueId)
		});

		return {
			display_id: findChat?.displayId
		};
	}
};
