import { checkUserAuth } from '$lib/server/check-auth';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}
	}
};
