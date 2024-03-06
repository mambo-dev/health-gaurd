import { db } from '$lib/db/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { chat, messages } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const searchParams = url.searchParams.get('displayId');

	if (!searchParams) {
		throw new Error('something terrible went wrong');
	}

	const findChat = await db.query.chat.findFirst({
		where: eq(chat.displayId, String(searchParams))
	});

	if (!findChat) {
		return error(412, {
			message: 'could not find chat'
		});
	}

	const findMessages = await db.query.messages.findMany({
		where: eq(messages.chatId, findChat.id)
	});

	if (!findMessages) {
		return new Response(JSON.stringify([]));
	}

	return new Response(JSON.stringify(findMessages));
};
