import { checkUserAuth } from '$lib/server/check-auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { uid } from 'uid';
import { db } from '$lib/db/db';
import { chat, messages, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { calculateAmr, calculateBmr } from '$lib/server/calculate_bmr';
import { getOpenAiResponse, type UserInfo } from '$lib/server/getOpenAiResponse';
import { getPromptAndResponse } from '$lib/server/promptResponse';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { error, userId } = checkUserAuth(locals);
	//@ts-expect-error cid exists in the params
	const chatId = params.cid;

	if (!userId || error) {
		return fail(403, { error });
	}

	if (!locals.user.id) {
		throw new Error('failed to attach id on login');
	}

	const chats = await db.query.chat.findMany({
		where: eq(chat.userId, userId)
	});

	const findChatAndMessages = await db.query.chat.findFirst({
		where: eq(chat.displayId, chatId),
		with: {
			messages: true
		}
	});

	if (!findChatAndMessages) {
		return {
			chats,
			messages: []
		};
	}

	return {
		chats,
		chatAndMessages: findChatAndMessages
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

		const bmr = await calculateBmr(userId);

		const amr = await calculateAmr(bmr, userId);
		const findUserAndDetails = await db.query.users.findFirst({
			where: eq(users.id, userId),
			with: {
				mealPreferences: true,
				goals: true,
				profile: true,
				dailySchedule: true,
				medicalHistory: true
			}
		});

		const medicalHistory = findUserAndDetails?.medicalHistory.map((history) => {
			return history.name;
		});

		const userGoals = findUserAndDetails?.goals.map((goal) => {
			return goal.title;
		});

		const userInfo: UserInfo = {
			amr,
			bmr,
			firstName: findUserAndDetails?.profile.firstName ?? 'user',
			goals:
				userGoals && userGoals?.length > 0
					? `has the followint medical history: ${userGoals.join(',')}`
					: 'user has no specific goals',
			mealPreference: `prefers ${findUserAndDetails?.mealPreferences[0].numberOfMeals} meals of ${findUserAndDetails?.mealPreferences[0].portionSizes} size`,
			medicalHistory:
				medicalHistory && medicalHistory?.length > 0
					? `has the followint medical history: ${medicalHistory.join(',')}`
					: 'user has no specific history'
		};

		const response = await getOpenAiResponse(messagePrompt, userInfo);

		const returnedMessage = await db
			.insert(messages)
			.values({
				prompt: messagePrompt,
				response: String(response),
				chatId: findChat.id
			})
			.returning();

		return {
			newMessage: returnedMessage[0]
		};
	},
	getResponseFromPrompt: async ({ locals, request }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const formData = await request.formData();
		const category = String(formData.get('promptCategory'));

		const tips = await getPromptAndResponse(category);

		return {
			tips
		};
	}
};
