import { Env, ChatMessage } from "./types";

const MODEL_ID = "@cf/meta/llama-3.1-8b-instruct-fp8";
const SYSTEM_PROMPT =
	"You are SmartTools AI, a helpful and friendly assistant. Reply in the same language as the user. If the user writes Arabic, answer naturally in Arabic. Keep answers clear, useful, and concise. Do not use Markdown formatting markers such as **, __, #, or backticks; use clean plain text with simple numbered or bullet lists when helpful.";

const SESSION_COOKIE = "st_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
			return env.ASSETS.fetch(request);
		}

		if (url.pathname === "/api/chat") {
			if (request.method === "POST") return handleChatRequest(request, env);
			return new Response("Method not allowed", { status: 405 });
		}

		if (url.pathname === "/api/auth/register" && request.method === "POST") {
			return register(request, env);
		}
		if (url.pathname === "/api/auth/login" && request.method === "POST") {
			return login(request, env);
		}
		if (url.pathname === "/api/auth/logout" && request.method === "POST") {
			return logout(request, env);
		}
		if (url.pathname === "/api/auth/me" && request.method === "GET") {
			return me(request, env);
		}
		if (url.pathname === "/api/store/plans" && request.method === "GET") {
			return json({
				plans: [
					{ id: "weekly", price: 0.99, currency: "USD", period: "week" },
					{ id: "monthly", price: 2.99, currency: "USD", period: "month" },
					{ id: "yearly", price: 19.99, currency: "USD", period: "year" },
				],
			});
		}

		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
	try {
		const { messages = [] } = (await request.json()) as { messages: ChatMessage[] };
		if (!messages.some((msg) => msg.role === "system")) {
			messages.unshift({ role: "system", content: SYSTEM_PROMPT });
		}
		const stream = await env.AI.run(MODEL_ID, {
			messages,
			max_tokens: 1024,
			stream: true,
		});
		return new Response(stream, {
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache",
				connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("Error processing chat request:", error);
		return json({ error: "Failed to process request" }, 500);
	}
}

function requireDb(env: Env): D1Database | Response {
	if (!env.DB) {
		return json(
			{
				error: "accounts_not_configured",
				message: "Account database is not configured yet.",
			},
			503,
		);
	}
	return env.DB;
}

async function register(request: Request, env: Env): Promise<Response> {
	const db = requireDb(env);
	if (db instanceof Response) return db;

	try {
		const body = (await request.json()) as { name?: string; email?: string; password?: string };
		const name = String(body.name || "").trim().slice(0, 80);
		const email = normalizeEmail(body.email);
		const password = String(body.password || "");

		if (!name) return json({ error: "name_required", message: "Name is required." }, 400);
		if (!validEmail(email)) return json({ error: "invalid_email", message: "Invalid email." }, 400);
		if (password.length < 8) {
			return json({ error: "weak_password", message: "Password must be at least 8 characters." }, 400);
		}

		const exists = await db.prepare("SELECT id FROM users WHERE email = ?1").bind(email).first<{ id: string }>();
		if (exists) return json({ error: "email_exists", message: "Email already registered." }, 409);

		const id = crypto.randomUUID();
		const salt = randomHex(16);
		const passwordHash = await passwordDigest(password, salt);
		const now = Math.floor(Date.now() / 1000);

		await db
			.prepare("INSERT INTO users (id, email, name, password_hash, password_salt, plan, created_at) VALUES (?1, ?2, ?3, ?4, ?5, 'free', ?6)")
			.bind(id, email, name, passwordHash, salt, now)
			.run();

		return createSessionResponse(db, id, { id, email, name, plan: "free" });
	} catch (error) {
		console.error("Register error:", error);
		return json({ error: "register_failed", message: "Could not create account." }, 500);
	}
}

async function login(request: Request, env: Env): Promise<Response> {
	const db = requireDb(env);
	if (db instanceof Response) return db;

	try {
		const body = (await request.json()) as { email?: string; password?: string };
		const email = normalizeEmail(body.email);
		const password = String(body.password || "");
		const user = await db
			.prepare("SELECT id, email, name, password_hash, password_salt, plan FROM users WHERE email = ?1")
			.bind(email)
			.first<{ id: string; email: string; name: string; password_hash: string; password_salt: string; plan: string }>();

		if (!user) return json({ error: "invalid_login", message: "Email or password is incorrect." }, 401);
		const candidate = await passwordDigest(password, user.password_salt);
		if (!constantEqual(candidate, user.password_hash)) {
			return json({ error: "invalid_login", message: "Email or password is incorrect." }, 401);
		}

		return createSessionResponse(db, user.id, {
			id: user.id,
			email: user.email,
			name: user.name,
			plan: user.plan || "free",
		});
	} catch (error) {
		console.error("Login error:", error);
		return json({ error: "login_failed", message: "Could not sign in." }, 500);
	}
}

async function logout(request: Request, env: Env): Promise<Response> {
	const db = requireDb(env);
	if (db instanceof Response) return db;
	const token = readCookie(request, SESSION_COOKIE);
	if (token) {
		const tokenHash = await sha256(token);
		await db.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(tokenHash).run();
	}
	return json(
		{ ok: true },
		200,
		{ "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` },
	);
}

async function me(request: Request, env: Env): Promise<Response> {
	const db = requireDb(env);
	if (db instanceof Response) return db;
	const token = readCookie(request, SESSION_COOKIE);
	if (!token) return json({ user: null });

	const tokenHash = await sha256(token);
	const now = Math.floor(Date.now() / 1000);
	const user = await db
		.prepare(
			"SELECT u.id, u.email, u.name, u.plan FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?1 AND s.expires_at > ?2",
		)
		.bind(tokenHash, now)
		.first<{ id: string; email: string; name: string; plan: string }>();

	return json({ user: user || null });
}

async function createSessionResponse(
	db: D1Database,
	userId: string,
	user: { id: string; email: string; name: string; plan: string },
): Promise<Response> {
	const token = randomHex(32);
	const tokenHash = await sha256(token);
	const now = Math.floor(Date.now() / 1000);
	const expires = now + SESSION_SECONDS;
	await db
		.prepare("INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5)")
		.bind(crypto.randomUUID(), userId, tokenHash, expires, now)
		.run();

	return json(
		{ ok: true, user },
		200,
		{
			"Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`,
		},
	);
}

function normalizeEmail(value: unknown): string {
	return String(value || "").trim().toLowerCase().slice(0, 254);
}

function validEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function randomHex(bytes: number): string {
	const data = new Uint8Array(bytes);
	crypto.getRandomValues(data);
	return [...data].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function passwordDigest(password: string, saltHex: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
	const salt = hexBytes(saltHex);
	const bits = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", hash: "SHA-256", salt, iterations: 120000 },
		key,
		256,
	);
	return bytesHex(new Uint8Array(bits));
}

async function sha256(value: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
	return bytesHex(new Uint8Array(digest));
}

function hexBytes(hex: string): Uint8Array {
	const clean = hex.replace(/[^0-9a-f]/gi, "");
	const out = new Uint8Array(Math.floor(clean.length / 2));
	for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
	return out;
}

function bytesHex(data: Uint8Array): string {
	return [...data].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
	const raw = request.headers.get("Cookie") || "";
	for (const item of raw.split(";")) {
		const [key, ...rest] = item.trim().split("=");
		if (key === name) return rest.join("=") || null;
	}
	return null;
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
			...extraHeaders,
		},
	});
}
