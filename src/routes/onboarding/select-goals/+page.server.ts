import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals }) => {
		if (!locals.user) {
			return fail(403, { error: 'oops sorry you need to be logged in for this part' });
		}
	}
};
