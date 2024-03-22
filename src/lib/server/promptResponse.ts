import fs from 'fs';

interface HealthTipsData {
	[category: string]: {
		prompt: string;
		tips: string[];
	};
}

export async function getPromptAndResponse(category: string) {
	try {
		const jsonData = fs.readFileSync(
			'/home/mambo-dev/workspace/github.com/mambo-dev/health_gaurd/src/lib/server/promptResponse.json',
			'utf-8'
		);
		const healthTips: HealthTipsData = JSON.parse(jsonData);
		return healthTips[category];
	} catch (error) {
		console.error('Error reading health tips data:', error);
		return null;
	}
}
