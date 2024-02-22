import { db } from '$lib/db/db';
import { profile } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { error, userId } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error: error });
	}

	const hasProfile = await db.query.profile.findFirst({
		where: eq(profile.userId, userId)
	});

	if (hasProfile) {
		return {
			profile: hasProfile
		};
	}

	return {
		profile: null
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error: error });
		}

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

		const hasProfile = await db.query.profile.findFirst({
			where: eq(profile.userId, userId)
		});

		if (hasProfile) {
			Object.keys(activity_level).forEach((key) => {
				if (key === activityLevel) {
					finalActivity = key;
				}
			});

			await db
				.update(profile)
				.set({
					firstName,
					secondName,
					bmi: calculate_bmi,
					//@ts-expect-error can update null
					activityLevel: `${finalActivity}`,
					age: age,
					height: height,
					//@ts-expect-error can update null
					sex: `${gender}`,
					weight: weight
				})
				.where(eq(profile.userId, userId));
		} else {
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
		}

		throw redirect(303, '/onboarding/select-goals');
	}
};
