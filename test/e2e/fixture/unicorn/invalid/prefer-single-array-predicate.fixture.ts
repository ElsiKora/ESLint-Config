interface Message {
	severity: string;
	type: string;
}

const messages: Array<Message> = [];

export const hasErrors = messages.some((message) => message.type === "error") || messages.some((message) => message.severity === "critical");
