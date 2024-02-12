import type { Cookies } from '@sveltejs/kit';

export function setAuthToken({
	cookies,
	access_token
}: {
	cookies: Cookies;
	access_token: string;
}) {
	cookies.set('access_token', `Bearer ${access_token}`, {
		path: '/',
		maxAge: 60 * 60 * 24
	});

	return true;
}
