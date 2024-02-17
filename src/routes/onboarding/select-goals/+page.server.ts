import { db } from '$lib/db/db';
import { goals } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		checkUserAuth(locals);
		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const userId: number = locals.user.id;

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

		if (findGoals) {
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

			throw redirect(303, '/onboarding/medical-history');
		}
		await db.insert(goals).values(selectedGoals);

		throw redirect(303, '/onboarding/medical-history');
	}
};
