export function checkUserAuth(locals: App.Locals) {
	if (!locals.user) {
		return {
			error: 'oops sorry you need to be logged in for this part'
		};
	}

	if (!locals.user.id) {
		throw new Error('failed to attach id on login');
	}

	const userId: number = locals.user.id;

	return {
		userId
	};
}
