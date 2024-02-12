import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createJwt } from '$lib/server/create_jwt';
import { setAuthToken } from '$lib/server/set_auth_token';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	signup: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));
		const confirmPassword = String(formData.get('confirmPassword'));

		if (password !== confirmPassword) {
			return fail(422, { error: 'passwords do not match' });
		}

		const findUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (findUser) {
			return fail(422, { error: 'This account already exists try loggin in' });
		}
		const hash = await bcrypt.hash(password, 14);

		const newUser = await db
			.insert(users)
			.values({ email, password: hash })
			.returning({ id: users.id, email: users.email });

		const access_token = createJwt(newUser[0]);

		setAuthToken({ cookies, access_token });

		throw redirect(303, '/onboarding/setup-profile');
	}
};
