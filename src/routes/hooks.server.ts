import { db } from '$lib/db/db';
import { users, type User } from '$lib/db/schema';
import { getJwtSecret } from '$lib/server/create_jwt';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('access_token');

	if (authCookie) {
		const access_token = authCookie.split(' ')[1];

		try {
			const jwtDetails = jwt.verify(access_token, getJwtSecret()) as Partial<User>;

			if (!jwtDetails || !jwtDetails.id) {
				throw new Error('could not decode the data');
			}

			const findUser = await db.query.users.findFirst({
				columns: {
					id: true,
					email: true
				},
				where: eq(users.id, jwtDetails.id)
			});

			if (findUser) {
				event.locals.user = findUser;
			}
		} catch (error) {
			throw new Error('could not verify identity');
		}
	}
	return await resolve(event);
};
