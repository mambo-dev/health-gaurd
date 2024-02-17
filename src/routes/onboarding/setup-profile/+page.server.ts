import { db } from '$lib/db/db';
import { profile } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		checkUserAuth(locals);

		const formData = await request.formData();

		const age = Number(formData.get('age'));
		const firstName = String(formData.get('firstName'));
		const secondName = String(formData.get('secondName'));
		const height = Number(formData.get('height'));
		const weight = Number(formData.get('weight'));
		const activityLevel = String(formData.get('activityLevel'));
		const gender = String(formData.get('gender'));
		const convert_cm_to_m = height / 100;

		const calculate_bmi = weight / (convert_cm_to_m * convert_cm_to_m);

		const activity_level = {
			sedentary: 'sedentary',
			lightly_active: 'Lightly active',
			moderately_active: 'Moderately active',
			very_active: 'Very active'
		};

		let finalActivity;

		const entries = Object.entries(activity_level);

		entries.forEach(([key, value]) => {
			if (value === activityLevel) {
				finalActivity = key;
			}
		});

		await db.insert(profile).values({
			//@ts-expect-error firstname exists
			firstName,
			secondName,
			bmi: calculate_bmi,
			userId: locals.user.id,
			activityLevel: `${finalActivity}`,
			age: age,
			height: height,
			sex: `${gender}`,
			weight: weight
		});

		throw redirect(303, '/onboarding/select-prefs');
	}
};
