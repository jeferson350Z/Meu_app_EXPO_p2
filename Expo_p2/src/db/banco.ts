import * as SQLite from 'expo-sqlite';

let aberto: Promise<SQLite.SQLiteDatabase> | null = null;

async function abrir() {
  const db = await SQLite.openDatabaseAsync('streaming.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      sal TEXT NOT NULL,
      criado_em INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fonte TEXT NOT NULL,
      titulo_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      poster TEXT,
      quando INTEGER NOT NULL,
      UNIQUE (usuario_id, fonte, titulo_id)
    );
    CREATE TABLE IF NOT EXISTS favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fonte TEXT NOT NULL,
      titulo_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      poster TEXT,
      quando INTEGER NOT NULL,
      UNIQUE (usuario_id, fonte, titulo_id)
    );
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fonte TEXT NOT NULL,
      titulo_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      poster TEXT,
      quando INTEGER NOT NULL,
      arquivo_uri TEXT NOT NULL,
      UNIQUE (usuario_id, fonte, titulo_id)
    );
  `);
  return db;
}

// Abre o banco uma única vez e reaproveita a mesma conexão em todo o app.
export function getDb() {
  if (!aberto) {
    aberto = abrir().catch((e) => {
      aberto = null; // permite tentar de novo se a abertura falhar
      throw e;
    });
  }
  return aberto;
}