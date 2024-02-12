import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { setAuthToken } from '$lib/server/set_auth_token';
import { createJwt } from '$lib/server/create_jwt';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	signin: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));

		const findUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!findUser) {
			return fail(422, { error: 'oops could not find this user, try registering' });
		}

		const validPassword = await bcrypt.compare(password, findUser.password);

		if (!validPassword) {
			return fail(422, { error: 'invalid password or email' });
		}

		const access_token = createJwt(findUser);

		setAuthToken({ cookies, access_token });

		throw redirect(303, '/dashboard');
	}
};
