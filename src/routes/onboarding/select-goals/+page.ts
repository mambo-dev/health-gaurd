import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const goal_options: string[] = [];

	return {
		goal_options
	};
};
