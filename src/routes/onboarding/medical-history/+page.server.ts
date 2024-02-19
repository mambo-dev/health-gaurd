import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db/db';
import { eq } from 'drizzle-orm';
import { medicalHistory } from '$lib/db/schema';

const historyOptions: string[] = [
	'Hypertension',
	'Diabetes',
	'Allergies',
	'Asthma',
	'Migraine headaches:'
];

export const load: PageServerLoad = async ({ locals }) => {
	const { userId, error } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	const findMedicalHistory = await db.query.medicalHistory.findMany({
		where: eq(medicalHistory.userId, userId)
	});

	if (!findMedicalHistory || findMedicalHistory.length <= 0) {
		return {
			availableHistory: [],
			historyOptions
		};
	}

	return {
		availableHistory: findMedicalHistory,
		historyOptions
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const formData = await request.formData();

		const selectedHistory: {
			name: string;
			userId: number;
		}[] = historyOptions
			.map((history) => {
				const value = formData.get(`option-${history.split(' ')[0]}`);

				return {
					name: String(value),
					userId
				};
			})
			.filter((history) => history.name !== 'null');

		if (selectedHistory.length <= 0) {
			return fail(422, {
				error: 'you can skip this step if you dont have or prefer not to share your medical history'
			});
		}

		const findMedicalHistory = await db.query.medicalHistory.findMany({
			where: eq(medicalHistory.userId, userId)
		});

		if (findMedicalHistory.length > 0) {
			const savedHistory = findMedicalHistory.map((history) => {
				return history.name;
			});

			if (savedHistory.length >= 5) {
				return fail(422, { error: 'You have already added all available goals' });
			}

			const savedHistoryObject: {
				[index: string]: string;
			} = {};

			savedHistory.forEach((history) => {
				savedHistoryObject[history] = history;
			});

			await db
				.insert(medicalHistory)
				.values(
					selectedHistory.filter(
						(history) => !Object.keys(savedHistoryObject).includes(history.name)
					)
				);
		} else {
			await db.insert(medicalHistory).values(selectedHistory);
		}

		throw redirect(303, '/onboarding/meal-preference');
	}
};
