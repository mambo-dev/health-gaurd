import { db } from '$lib/db/db';
import { chat, messages } from '$lib/db/schema';
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
	},
	sendMessage: async ({ locals, request }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const formData = await request.formData();
		const messagePrompt = String(formData.get('message'));
		const displayId = String(formData.get('displayId'));

		const findChat = await db.query.chat.findFirst({
			where: eq(chat.displayId, displayId)
		});
		if (!findChat) {
			throw new Error('failed to find this chat');
		}

		const response =
			'we received your message but we are currently not able to process it  thank you for your patience';

		const returnedMessage = await db
			.insert(messages)
			.values({
				prompt: messagePrompt,
				response,
				chatId: findChat.id
			})
			.returning();

		return {
			message: returnedMessage[0].prompt,
			response: returnedMessage[0].response
		};
	}
};
