import type { User } from '$lib/db/schema';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

if (!env.JWT_SECRET) {
	throw new Error('jwt secret not configured');
}

export function getJwtSecret(): string {
	if (!env.JWT_SECRET) {
		throw new Error('jwt secret not configured');
	}

	return env.JWT_SECRET;
}

export function createJwt(user: Partial<User>) {
	return jwt.sign({ id: user.id, email: user.email }, getJwtSecret(), {
		expiresIn: '1d'
	});
}
