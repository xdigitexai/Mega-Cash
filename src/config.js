import path from 'node:path';

export function config(env = process.env) {
  return {
    port: Number(env.PORT || 3000),
    databasePath: path.resolve(env.DATABASE_PATH || 'data/money-habour.db'),
    sessionSecret: env.SESSION_SECRET || 'local-development-only-change-this-secret',
    appUrl: (env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''),
    xdigitexApiKey: env.XDIGITEX_PAY_API_KEY || '',
    xdigitexBaseUrl: (env.XDIGITEX_PAY_BASE_URL || 'https://pay.xdigitex.space/api').replace(/\/$/, ''),
  };
}

export function normalizeUgandaPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? `256${digits.slice(1)}` : digits;
  if (!/^2567\d{8}$/.test(normalized)) throw new Error('Use a valid Uganda mobile number');
  return `+${normalized}`;
}
