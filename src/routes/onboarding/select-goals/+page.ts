import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const goal_options: string[] = [
		'Weight management',
		'Diabetes management',
		'Overall wellness',
		'Heart health',
		'Stress management'
	];

	if (data.goals && data.goals.length > 0) {
		return {
			goals: data.goals,
			goal_options
		};
	}

	return {
		goal_options
	};
};
