import { db } from '$lib/db/db';
import { goals } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { error, userId } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	const findGoals = await db.query.goals.findMany({
		where: eq(goals.userId, userId)
	});

	if (!findGoals) {
		return {
			goals: []
		};
	}

	return {
		goals: findGoals
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const goal_options: string[] = [
			'Weight management',
			'Diabetes management',
			'Overall wellness',
			'Heart health',
			'Stress management'
		];

		const formData = await request.formData();

		const selectedGoals: {
			title: string;
			userId: number;
		}[] = goal_options
			.map((goal) => {
				const value = formData.get(`option-${goal.split(' ')[0]}`);

				return {
					title: String(value),
					userId
				};
			})
			.filter((goal) => goal.title !== 'null');

		if (selectedGoals.length <= 0) {
			return fail(422, { error: 'you must select atleast one goal' });
		}

		const findGoals = await db.query.goals.findMany({
			where: eq(goals.userId, userId)
		});

		if (findGoals.length > 0) {
			const savedGoals = findGoals.map((goals) => {
				return goals.title;
			});

			if (savedGoals.length >= 5) {
				return fail(422, { error: 'You have already added all available goals' });
			}

			const savedGoalsObject: {
				[index: string]: string;
			} = {};

			savedGoals.forEach((goal) => {
				savedGoalsObject[goal] = goal;
			});

			await db
				.insert(goals)
				.values(
					selectedGoals.filter((goal) => !Object.keys(savedGoalsObject).includes(goal.title))
				);
		} else {
			await db.insert(goals).values(selectedGoals);
		}

		throw redirect(303, '/onboarding/medical-history');
	}
};
