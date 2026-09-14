import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export function openDatabase(filename) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  return db;
}

export function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = fn(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}

export const now = () => new Date().toISOString();
export const id = (prefix) => `${prefix}_${crypto.randomUUID()}`;

export function balance(db, walletId, bucket) {
  return Number(db.prepare(`SELECT COALESCE(SUM(amount),0) value FROM ledger_entries WHERE wallet_id=? AND bucket=?`).get(walletId, bucket).value);
}

export function postBalanced(db, { reference, type, entries, metadata = {} }) {
  const total = entries.reduce((sum, item) => sum + item.amount, 0);
  if (!Number.isSafeInteger(total) || total !== 0) throw new Error('Ledger transaction must balance');
  const created = now();
  for (const entry of entries) {
    if (!Number.isSafeInteger(entry.amount) || entry.amount === 0) throw new Error('Ledger amount must be a non-zero integer');
    db.prepare(`INSERT INTO ledger_entries(id,wallet_id,bucket,amount,type,reference,metadata,created_at) VALUES(?,?,?,?,?,?,?,?)`)
      .run(id('led'), entry.walletId ?? null, entry.bucket, entry.amount, type, reference, JSON.stringify(metadata), created);
  }
}
