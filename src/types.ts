/**
 * Type definitions for SmartTools AI.
 */
export interface Env {
	AI: Ai;
	ASSETS: { fetch: (request: Request) => Promise<Response> };
	/**
	 * Optional D1 database binding used by account authentication.
	 * Bind a D1 database as "DB" in Cloudflare to enable real accounts.
	 */
	DB?: D1Database;
}

export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
