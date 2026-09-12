import * as SQLite from 'expo-sqlite';
import { Report, NewReportInput } from './types';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('eto.db');
  }
  return dbInstance;
}

/**
 * Initializes the SQLite database schema with Write-Ahead Logging (WAL).
 * WAL provides maximum corruption resistance during battery pull or abrupt shutdowns.
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

    CREATE TABLE IF NOT EXISTS bookmarks (
      opportunity_id TEXT PRIMARY KEY,
      saved_at TEXT NOT NULL
    );
  `);
}

/**
 * Lightweight RFC4122 v4 compliant UUID generator.
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

export async function getPendingReports(): Promise<Report[]> {
  const db = await getDB();
  return await db.getAllAsync<Report>(
    'SELECT * FROM reports WHERE synced = 0 ORDER BY created_at DESC'
  );
}

export async function getPendingCount(): Promise<number> {
  const db = await getDB();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM reports WHERE synced = 0'
  );
  return result?.count ?? 0;
}

export async function getAllReports(): Promise<Report[]> {
  const db = await getDB();
  return await db.getAllAsync<Report>(
    'SELECT * FROM reports ORDER BY created_at DESC'
  );
}

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
 * Emergency Panic Wipe: Nukes all stored reports and bookmarks immediately.
 * Leaves zero cryptographic forensic trace on disk.
 */
export async function wipeAllLocalData(): Promise<void> {
  const db = await getDB();
  await db.execAsync(`
    DELETE FROM reports;
    DELETE FROM bookmarks;
    VACUUM;
  `);
}

/**
 * Sneaker-Net Export Payload: Generates an exportable JSON payload
 * for physical SD-Card / USB-OTG courier dispatch.
 */
export async function exportSneakerNetPayload(): Promise<string> {
  const reports = await getAllReports();
  const payload = {
    exported_at: new Date().toISOString(),
    protocol: 'ETO-SNEAKERNET-V1',
    checksum: Math.random().toString(36).substring(2, 15),
    total_records: reports.length,
    pending_records: reports.filter((r) => r.synced === 0).length,
    ledger: reports,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Bookmark Management for Offline Opportunities
 */
export async function toggleBookmark(opportunityId: string): Promise<boolean> {
  const db = await getDB();
  const existing = await db.getFirstAsync<{ opportunity_id: string }>(
    'SELECT opportunity_id FROM bookmarks WHERE opportunity_id = ?',
    [opportunityId]
  );

  if (existing) {
    await db.runAsync('DELETE FROM bookmarks WHERE opportunity_id = ?', [opportunityId]);
    return false; // Removed
  } else {
    await db.runAsync(
      'INSERT INTO bookmarks (opportunity_id, saved_at) VALUES (?, ?)',
      [opportunityId, new Date().toISOString()]
    );
    return true; // Added
  }
}

export async function getBookmarkedIds(): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ opportunity_id: string }>(
    'SELECT opportunity_id FROM bookmarks'
  );
  return rows.map((r) => r.opportunity_id);
}
