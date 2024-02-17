import { fail } from '@sveltejs/kit';

export function checkUserAuth(locals: App.Locals) {
	if (!locals.user) {
		return fail(403, { error: 'oops sorry you need to be logged in for this part' });
	}

	return true;
}
