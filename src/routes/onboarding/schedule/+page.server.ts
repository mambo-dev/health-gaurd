import { db } from '$lib/db/db';
import { dailySchedule, notifications } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { error, userId } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	const hasSchecule = await db.query.dailySchedule.findFirst({
		where: eq(dailySchedule.userId, userId)
	});

	if (hasSchecule) {
		return {
			schedule: hasSchecule
		};
	}

	return {
		schedule: undefined
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		const formData = await request.formData();

		const wakeUp = String(formData.get('wakeUp'));
		const bedTime = String(formData.get('bedTime'));
		const notification = String(formData.get('notification'));

		if (!wakeUp || !bedTime) {
			return fail(422, {
				error: !wakeUp ? 'sorry wake up time is required' : 'sorry bed time is required'
			});
		}

		const hasSchecule = await db.query.dailySchedule.findFirst({
			where: eq(dailySchedule.userId, userId)
		});

		if (hasSchecule) {
			await db.update(dailySchedule).set({
				bedTime,
				wakeUp
			});
		} else {
			await db.insert(dailySchedule).values({
				userId: userId,
				bedTime,
				wakeUp
			});
		}

		if (notification === 'true') {
			await db.insert(notifications).values({ userId, receiveReminders: true });
		}

		throw redirect(303, '/dashboard');
	}
};
