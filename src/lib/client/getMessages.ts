export type ReturnedMessages = {
	id: number;
	prompt: string;
	response: string;
	chatId: number;
}[];

export async function getChatMessages(displayId: string): Promise<ReturnedMessages> {
	try {
		const response = await fetch(`/dashboard/chat/messages?displayId=${displayId}`);

		const chatMessages = await response.json();

		if (!chatMessages) {
			throw new Error('could not get chats');
		}

		return chatMessages;
	} catch (error: unknown) {
		throw new Error('could not get messages');
	}
}
