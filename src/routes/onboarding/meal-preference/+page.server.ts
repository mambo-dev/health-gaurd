import { db } from '$lib/db/db';
import { mealPreferences } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		const formData = await request.formData();

		const portionSizes = String(formData.get('portionSizes'));
		const numberOfMeals = String(formData.get('numberOfMeals'));

		if (!portionSizes || !numberOfMeals) {
			return fail(422, { error: 'sorry we require both entries please' });
		}

		await db.insert(mealPreferences).values({
			//@ts-expect-error userId exists
			userId: userId,
			numberOfMeals,
			portionSizes: `${portionSizes}`
		});

		throw redirect(303, '/onboarding/daily-schedule');
	}
};
