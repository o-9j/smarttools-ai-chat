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
	/** Resend API key used only to deliver password reset emails. */
	RESEND_API_KEY?: string;
	/** Verified sender address configured in Resend. */
	RESET_FROM_EMAIL?: string;
}

export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
