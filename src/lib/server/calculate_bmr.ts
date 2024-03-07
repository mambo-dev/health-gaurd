import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function calculateBmr(userId: number) {
	try {
		const findUserAndProfile = await db.query.users.findFirst({
			where: eq(users.id, userId),
			with: {
				profile: true,
				medicalHistory: true,
				mealPreferences: true
			}
		});

		if (!findUserAndProfile || !findUserAndProfile.profile) {
			throw new Error('sorrry we could not find a profile attached to this user');
		}

		const profile = {
			sex: findUserAndProfile.profile.sex,
			age: findUserAndProfile.profile.age,
			weight: findUserAndProfile.profile.weight,
			height: findUserAndProfile.profile.height
		};

		let bmr: number = 0;

		if (profile.sex === 'female') {
			bmr = 655.1 + 9.563 * profile.weight + 1.85 * profile.height - 4.676 * profile.age;
			return Math.floor(bmr);
		}

		if (profile.sex === 'male') {
			bmr = 66.47 + 3.75 * profile.weight + 5.003 * profile.height - 6.755 * profile.age;
			return Math.floor(bmr);
		}

		return Math.floor(bmr);
	} catch (error: unknown) {
		throw new Error(error.message);
	}
}

export async function calculateAmr(bmr: number, userId: number) {
	try {
		const findUserAndProfile = await db.query.users.findFirst({
			where: eq(users.id, userId),
			with: {
				profile: true,
				medicalHistory: true,
				mealPreferences: true
			}
		});

		if (!findUserAndProfile || !findUserAndProfile.profile) {
			throw new Error('sorrry we could not find a profile attached to this user');
		}

		type ActivityLevels = {
			[level: string]: number;
		};

		const activityMap: ActivityLevels = {
			sedentary: 1.2,
			lightly_active: 1.375,
			moderately_active: 1.55,
			active: 1.725,
			very_active: 1.9
		};

		return bmr * activityMap[findUserAndProfile.profile.activityLevel];
	} catch (error) {
		throw new Error(error.message);
	}
}
