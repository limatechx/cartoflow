import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { JWT_SECRET } from '../config/jwt';
import type { UserRow, UserPublic } from '../types/user';

export const AuthController = {
  login(req: Request, res: Response): void {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;

    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const senhaCorreta = bcrypt.compareSync(senha, user.senha);

    if (!senhaCorreta) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
      },
    });
  },

  me(req: Request, res: Response): void {
    const { id } = req.user!;

    const user = db
      .prepare('SELECT id, nome, email, perfil, created_at, updated_at FROM users WHERE id = ?')
      .get(id) as UserPublic | undefined;

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.json(user);
  },
};
