import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const goal_options: string[] = [
		'Weight management',
		'Diabetes management',
		'Overall wellness',
		'Heart health',
		'Stress management'
	];

	return {
		goal_options
	};
};
