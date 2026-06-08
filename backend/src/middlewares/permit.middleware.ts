import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from './auth.middleware';

type Perfil = JwtPayload['perfil'];

export function permit(...perfisPermitidos: Perfil[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload | undefined;

    if (!user) {
      res.status(401).json({ error: 'Não autenticado.' });
      return;
    }

    if (!perfisPermitidos.includes(user.perfil)) {
      res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
      return;
    }

    next();
  };
}
