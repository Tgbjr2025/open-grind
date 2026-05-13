import { sendMessage, reactToMessage } from "$lib/api/messages";
import type {
	ApiResponseMessage,
	Message as MessageType,
} from "$lib/model/message";
import { conversations } from "../conversations.svelte";
import { getConversation } from "./messages";
import toast from "svelte-french-toast";

export type OptimisticMessage = ApiResponseMessage & {
	status: "sent" | "pending" | "error";
};

type Profile = Awaited<ReturnType<typeof getConversation>>["profile"];

export class ConversationState {
	messages = $state<OptimisticMessage[]>([]);
	profile = $state<Profile | null>(null);
	pageKey = $state<string | null>(null);
	loading = $state(true);
	loadingMore = $state(false);
	error = $state<Error | null>(null);

	readonly conversationId: string;
	readonly ourProfileId: number;

	constructor(conversationId: string, ourProfileId: number) {
		this.conversationId = conversationId;
		this.ourProfileId = ourProfileId;
		void this.#initialLoad();
	}

	async #initialLoad(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const result = await getConversation({
				conversationId: this.conversationId,
			});
			this.messages = result.messages.map((m) => ({
				...m,
				status: "sent" as const,
			}));
			this.profile = result.profile;
			this.pageKey = result.pageKey;
			this.#updatePreview(this.messages.at(0));
			conversations.markRead(this.conversationId);
		} catch (err) {
			this.error = err instanceof Error ? err : new Error(String(err));
		} finally {
			this.loading = false;
		}
	}

	async loadMore(): Promise<void> {
		if (this.loadingMore || this.pageKey === null) return;
		this.loadingMore = true;
		try {
			const result = await getConversation({
				conversationId: this.conversationId,
				pageKey: this.pageKey,
			});
			this.messages = [
				...this.messages,
				...result.messages.map((m) => ({ ...m, status: "sent" as const })),
			];
			this.pageKey = result.pageKey;
		} catch (err) {
			toast.error("Failed to load more messages");
			console.error(err);
		} finally {
			this.loadingMore = false;
		}
	}

	send(message: MessageType): void {
		if (!this.profile) return;
		const tempId = `pending-${crypto.randomUUID()}`;
		const optimistic = {
			...message,
			messageId: tempId,
			conversationId: this.conversationId,
			senderId: this.ourProfileId,
			timestamp: Date.now(),
			unsent: false,
			reactions: [],
			status: "pending" as const,
		} as OptimisticMessage;
		this.messages = [optimistic, ...this.messages];
		this.#updatePreview(optimistic);
		void this.#resolveMessage({ tempId, message });
	}

	async #resolveMessage({
		tempId,
		message,
	}: {
		tempId: string;
		message: MessageType;
	}): Promise<void> {
		try {
			await sendMessage({
				toUserId: this.profile!.profileId,
				message,
			});
			const msg = this.messages.find((m) => m.messageId === tempId);
			if (msg) msg.status = "sent";
		} catch {
			const msg = this.messages.find((m) => m.messageId === tempId);
			if (msg) msg.status = "error";
			const latestSent = this.messages.find((m) => m.status === "sent");
			this.#updatePreview(latestSent);
		}
	}

	#updatePreview(message: OptimisticMessage | undefined) {
		conversations.updatePreview({
			conversationId: this.conversationId,
			preview: this.#previewFromMessage(message),
			timestamp: message?.timestamp ?? 0,
		});
	}

	remove(messageId: string) {
		const isLatest = this.messages.at(0)?.messageId === messageId;
		const removedIndex = this.messages.findIndex(
			(m) => m.messageId === messageId,
		);
		const removed = this.messages.splice(removedIndex, 1)[0];
		if (isLatest) {
			this.#updatePreview(this.messages.at(0));
		}
		return {
			revert: () => {
				if (removed) {
					this.messages.splice(removedIndex, 0, removed);
					if (isLatest) this.#updatePreview(removed);
				}
			},
		};
	}

	#previewFromMessage(message: OptimisticMessage | undefined): {
		type: string;
		text: string | null;
		albumId: number | null;
		imageHash: string | null;
	} {
		if (!message)
			return { type: "", text: null, albumId: null, imageHash: null };
		switch (message.type) {
			case "Text":
				return {
					type: "Text",
					text: message.body.text,
					albumId: null,
					imageHash: null,
				};
			case "Image":
			case "ExpiringImage":
			case "Album":
			case "ExpiringAlbum":
			case "ExpiringAlbumV2":
			default:
				return {
					type: message.type,
					text: null,
					albumId: null,
					imageHash: null,
				};
		}
	}

	async reactTo(messageId: string, reactionType: number): Promise<void> {
		const msg = this.messages.find((m) => m.messageId === messageId);
		if (!msg) return;
		msg.reactions.push({ reactionType, profileId: this.ourProfileId });
		try {
			await reactToMessage({
				conversationId: this.conversationId,
				messageId,
				reactionType,
			});
		} catch (err) {
			msg.reactions.pop();
			throw err;
		}
	}
}
