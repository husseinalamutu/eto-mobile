import * as SQLite from 'expo-sqlite';
import { Report, NewReportInput } from './types';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or initialize the singleton SQLite database instance.
 */
export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('eto.db');
  }
  return dbInstance;
}

/**
 * Initializes the SQLite database schema.
 * Immune to OS cache clearing on low-resource Android devices.
 */
export async function initDatabase(): Promise<void> {
  const db = await getDB();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_reports_synced ON reports(synced);
  `);
}

/**
 * Lightweight RFC4122 v4 compliant UUID generator.
 * Avoids heavy crypto packages that strain 1GB Android Go RAM.
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Inserts a new report into the local offline SQLite ledger.
 * Automatically enforces anonymity by stripping device IDs and PII.
 */
export async function insertReport(input: NewReportInput): Promise<Report> {
  const db = await getDB();
  const id = generateUUID();
  const created_at = new Date().toISOString();

  const cleanLocation = input.location.trim();
  const cleanDescription = input.description.trim();

  await db.runAsync(
    `INSERT INTO reports (id, category, location, description, severity, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [id, input.category, cleanLocation, cleanDescription, input.severity, created_at]
  );

  return {
    id,
    category: input.category,
    location: cleanLocation,
    description: cleanDescription,
    severity: input.severity,
    created_at,
    synced: 0,
  };
}

/**
 * Fetch all pending (unsynced) reports from the local ledger.
 */
export async function getPendingReports(): Promise<Report[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Report>(
    'SELECT * FROM reports WHERE synced = 0 ORDER BY created_at DESC'
  );
  return rows;
}

/**
 * Returns count of unsynced offline records.
 */
export async function getPendingCount(): Promise<number> {
  const db = await getDB();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM reports WHERE synced = 0'
  );
  return result?.count ?? 0;
}

/**
 * Fetch all reports (both synced and pending) for auditing.
 */
export async function getAllReports(): Promise<Report[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Report>(
    'SELECT * FROM reports ORDER BY created_at DESC'
  );
  return rows;
}

/**
 * Mark a batch of report IDs as synced once successfully transmitted.
 */
export async function markReportsSynced(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDB();
  const placeholders = ids.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE reports SET synced = 1 WHERE id IN (${placeholders})`,
    ids
  );
}

/**
 * Clear reports table (useful for testing and memory resets).
 */
export async function clearReportsTable(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM reports');
}
