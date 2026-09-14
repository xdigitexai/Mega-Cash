# Money Habour

Uganda-first business funding platform. Money values are stored as integer UGX amounts, balances are derived from an immutable double-entry wallet ledger, and projected returns never become withdrawable until an authorized realized-earnings credit is posted.

## Run locally

Requires Node.js 22.5+ (tested with Node 24).

```sh
cp .env.example .env
npm run migrate
npm test
npm start
```

Set `SESSION_SECRET` and `XDIGITEX_PAY_API_KEY` in the environment. An admin is seeded only when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are provided. Xdigitex Pay calls follow the [official API documentation](https://pay.xdigitex.space/docs): `X-API-Key`, gateway `mobile`, UGX, `/payments/initiate`, `/payments/{reference}/status`, and `/withdrawals`.

## Financial controls

- Ledger rows cannot be updated or deleted by the application database user.
- Wallet changes are balanced between wallet buckets and platform clearing accounts in one database transaction.
- Unique idempotency keys and gateway references prevent duplicate credits and payouts.
- Webhooks do not trust their payload: completed deposits are credited only after Xdigitex confirms `completed` through its status API.
- Withdrawals reserve funds in `PENDING_WITHDRAWAL`; failures reverse the reservation exactly once.
- Committed capital cannot be withdrawn. Projections are display-only.
