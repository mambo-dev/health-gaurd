import { env } from '$env/dynamic/private';
import { db } from '$lib/db/db';
import { promptManagement, type PromptT } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { encode } from 'gpt-3-encoder';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

function getOpenAiApiKey() {
	if (!env.OPENAI_API_KEY) {
		throw new Error('open ai api key was not set');
	}

	return env.OPENAI_API_KEY;
}

const openai = new OpenAI({
	apiKey: getOpenAiApiKey()
});

export type UserInfo = {
	firstName: string;
	bmr: number;
	amr: number;
	goals: string;
	mealPreference: string;
	medicalHistory: string;
};

export async function getOpenAiResponse(prompt: string, userInfo: UserInfo) {
	const promptSize = getTokenSize(prompt);

	if (promptSize > 30) {
		return 'sorry this prompt is too long! kindly keep you prompts brief and concise';
	}

	const dayPrompts = await limitNumberOfPrompts();

	if (dayPrompts > 5) {
		return 'oops!! sorry but you have exeeded the allocated number of prompts for the day Please come back tommorrow';
	}

	const systemMessage: ChatCompletionMessageParam = {
		role: 'system',
		content: `You are a health assistant, You help people with health related issues, Your name is Health-G, You take into consideration the following as you answer
            ${JSON.stringify(userInfo)}, If applicable give user responses based on the consideration"
            `
	};

	const userMessage: ChatCompletionMessageParam = {
		role: 'user',
		content: `${prompt}, keep it brief, clear and straight to the point`
	};

	const conversation: ChatCompletionMessageParam[] = [systemMessage, userMessage];

	const model = 'gpt-3.5-turbo-0125';

	const completion = await openai.chat.completions.create({
		messages: conversation,
		model: model,
		max_tokens: 500,
		temperature: 0.4
	});

	getTokenSize(String(completion.choices[0].message.content));
	return completion.choices[0].message.content;
}

function getTokenSize(content: string) {
	const encoded = encode(content);

	return encoded.length;
}

async function limitNumberOfPrompts() {
	const findPromptManagement: PromptT | undefined = await db.query.promptManagement.findFirst();
	const todaysDate = new Date();

	if (!findPromptManagement) {
		const newPrompt = await db
			.insert(promptManagement)
			.values({
				numberOfPrompts: 0,
				dayOfprompt: String(new Date())
			})
			.returning({
				numberOfPrompts: promptManagement.numberOfPrompts
			});

		return newPrompt[0].numberOfPrompts;
	}
	const savedDay = new Date(findPromptManagement.dayOfprompt);

	const sameDay =
		todaysDate.getDate() === savedDay.getDate() &&
		todaysDate.getMonth() === savedDay.getMonth() &&
		todaysDate.getFullYear() === savedDay.getFullYear();

	if (sameDay) {
		const remainingPrompts = await db
			.update(promptManagement)
			.set({
				numberOfPrompts: (findPromptManagement.numberOfPrompts += 1)
			})
			.where(eq(promptManagement.id, findPromptManagement.id))
			.returning({
				numberOfPrompts: promptManagement.numberOfPrompts
			});

		return remainingPrompts[0].numberOfPrompts;
	}

	const remainingPrompts = await db
		.update(promptManagement)
		.set({
			numberOfPrompts: 0,
			dayOfprompt: String(todaysDate)
		})
		.where(eq(promptManagement.id, findPromptManagement.id))
		.returning({
			numberOfPrompts: promptManagement.numberOfPrompts
		});

	return remainingPrompts[0].numberOfPrompts;
}
