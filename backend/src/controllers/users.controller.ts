import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database';
import type { UserRow } from '../types/user';

export const UsersController = {
  list(_req: Request, res: Response): void {
    const users = db
      .prepare('SELECT id, nome, email, perfil, created_at, updated_at FROM users ORDER BY id ASC')
      .all();
    res.json(users);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    const user = db
      .prepare('SELECT id, nome, email, perfil, created_at, updated_at FROM users WHERE id = ?')
      .get(id) as Omit<UserRow, 'senha'> | undefined;

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.json(user);
  },

  create(req: Request, res: Response): void {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
      return;
    }

    const perfilValido = perfil && ['Administrador', 'Atendente'].includes(perfil) ? perfil : 'Atendente';

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'Email já cadastrado.' });
      return;
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    const result = db
      .prepare(
        'INSERT INTO users (nome, email, senha, perfil) VALUES (?, ?, ?, ?)'
      )
      .run(nome, email, senhaHash, perfilValido);

    const newUser = db
      .prepare('SELECT id, nome, email, perfil, created_at, updated_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json(newUser);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const { nome, email, senha, perfil } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    if (email && email !== user.email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (existing) {
        res.status(409).json({ error: 'Email já está em uso por outro usuário.' });
        return;
      }
    }

    const novoNome = nome ?? user.nome;
    const novoEmail = email ?? user.email;
    const novoPerfil = perfil && ['Administrador', 'Atendente'].includes(perfil) ? perfil : user.perfil;
    const novaSenha = senha ? bcrypt.hashSync(senha, 10) : user.senha;

    db.prepare(
      'UPDATE users SET nome = ?, email = ?, senha = ?, perfil = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(novoNome, novoEmail, novaSenha, novoPerfil, id);

    const updated = db
      .prepare('SELECT id, nome, email, perfil, created_at, updated_at FROM users WHERE id = ?')
      .get(id);

    res.json(updated);
  },

  remove(req: Request, res: Response): void {
    const { id } = req.params;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    if (req.user!.id === Number(id)) {
      res.status(400).json({ error: 'Você não pode remover seu próprio usuário.' });
      return;
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(204).send();
  },
};
