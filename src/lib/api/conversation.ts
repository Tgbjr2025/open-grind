import z from "zod";
import { fetchRest } from "$lib/api";
import { fullConversationSchema } from "$lib/model/conversation";
import { apiResponseMessageSchema, messageSchema } from "$lib/model/message";

const conversationsSchema = z.object({
	entries: z.array(fullConversationSchema),
	nextPage: z.number().nullable(),
});

const conversationMessagesSchema = z.object({
	messages: z.array(apiResponseMessageSchema),
	profile: z.object({
		distance: z.number().nullable(),
		mediaHash: z.string().nullable(),
		name: z.string().nullable(),
		onlineUntil: z.number().nullable(),
		profileId: z.number().int(),
		showDistance: z.boolean(),
	}),
});

export async function getConversations(page: number = 1) {
	const conversations = await fetchRest(
		"/v4/inbox?" + new URLSearchParams({ page: String(page) }),
		{
			method: "POST",
		},
	).then((res) => res.jsonParsed(conversationsSchema));
	return conversations;
}

export async function getConversationMessages(conversationId: string) {
	const messages = await fetchRest(
		`/v5/chat/conversation/${conversationId}/message?` +
			new URLSearchParams({ profile: "true" }),
		{
			method: "GET",
		},
	).then((res) => res.jsonParsed(conversationMessagesSchema));
	return messages;
}

export async function sendMessage({
	toUserId,
	message,
}: {
	toUserId: number;
	message: z.infer<typeof messageSchema>;
}) {
	await fetchRest("/v4/chat/message/send", {
		method: "POST",
		body: {
			type: message.type,
			target: {
				type: "Direct",
				targetId: toUserId,
			},
			body: message.body,
		},
	});
}
