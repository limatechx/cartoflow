import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve(__dirname, '..', '..', 'database.sqlite');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      senha      TEXT NOT NULL,
      perfil     TEXT NOT NULL DEFAULT 'Atendente' CHECK(perfil IN ('Administrador', 'Atendente')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo             TEXT NOT NULL CHECK(tipo IN ('Certidão de Nascimento', 'Reconhecimento de Firma', 'Autenticação', 'Escritura', 'Outro')),
      nome_solicitante TEXT NOT NULL,
      cpf_solicitante  TEXT NOT NULL,
      descricao        TEXT,
      status           TEXT NOT NULL DEFAULT 'Aguardando' CHECK(status IN ('Aguardando', 'Em andamento', 'Concluído')),
      data_solicitacao TEXT NOT NULL,
      observacoes      TEXT,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initDatabase();

export default db;
