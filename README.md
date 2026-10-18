# SmartTools AI Chat — Cloudflare Worker

This repository is the **smarttools-ai-chat** Worker, not the separate **smarttools-ai-api** Worker.

## Implemented
- AI chat endpoint: `POST /api/chat`
- Account endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Informational plan list: `GET /api/store/plans`
- Secure, HttpOnly session cookie and PBKDF2 password hashes

**Not implemented:** verified App Store / Google Play payments, subscription activation, ads, mobile app integration, and production-grade abuse controls. Prices in the plans endpoint are illustrative only.

## Existing D1 database setup

The separately created D1 database is named `smarttools-users`. Its initial `users` table lacks `name` and `password_salt`, and it lacks the `sessions` table needed by this Worker.

1. In Cloudflare D1, select `smarttools-users` and run the SQL in `migrations/0001_existing_d1_auth.sql` **once** using the D1 Console. Do not apply `schema.sql` on top of the existing database as a replacement.
2. In this repository's `wrangler.jsonc`, add a D1 binding **after retrieving the real database UUID from Cloudflare**:
   ```json
   "d1_databases": [
     { "binding": "DB", "database_name": "smarttools-users", "database_id": "ACTUAL-D1-DATABASE-UUID" }
   ]
   ```
   Do not use a made-up UUID. This repository currently has no D1 binding in Wrangler.
3. Deploy **smarttools-ai-chat** and verify `/api/auth/me` responds with `{"user":null}` when logged out. Then test registration, login, and logout.
4. Do not assume binding the separate `smarttools-ai-api` Worker automatically binds this Worker; bindings are configured independently.

## Security and launch checklist

- Rate-limit registration, login, and AI chat before public launch.
- Validate requests and use origin/CSRF protections for cookie-authenticated state changes.
- Do not grant paid plans based on client input. Validate Apple/Google store purchase notifications server-side.
- Verify email ownership, implement password recovery, account deletion, and privacy/terms before launch.
- Configure CORS and a suitable mobile authentication strategy if calling this API from Expo/React Native.

## Development

```bash
npm install
npm run check
npm run dev
```

Worker source: `src/index.ts`. Static chat frontend: `public/`. Database schema for a fresh installation: `schema.sql`.
