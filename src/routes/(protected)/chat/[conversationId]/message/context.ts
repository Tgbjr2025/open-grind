import { createContext } from "svelte";

export const [getMessageContext, setMessageContext] = createContext<
	() => {
		firstInStack: boolean;
		lastInStack: boolean;
		indexInStack: number;
		msgOut: boolean;
		timestamp: number;
	}
>();
