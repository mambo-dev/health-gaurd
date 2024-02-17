import { db } from '$lib/db/db';
import { dailySchedule, notifications } from '$lib/db/schema';
import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';

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

		await db.insert(dailySchedule).values({
			userId: userId,
			bedTime,
			wakeUp
		});

		if (notification === 'true') {
			await db.insert(notifications).values({ userId, receiveReminders: true });
		}

		throw redirect(303, '/dashboard');
	}
};
