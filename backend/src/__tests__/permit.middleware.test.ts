import { Request, Response, NextFunction } from 'express';
import { permit } from '../middlewares/permit.middleware';
import { mockRes } from './helpers/mockRes';

const mockNext = jest.fn() as NextFunction;

describe('permit middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 401 quando não há usuário autenticado na requisição', () => {
    const req = {} as Request;
    const res = mockRes();

    permit('Administrador')(req, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Não autenticado.' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retorna 403 quando o usuário tem perfil diferente do exigido', () => {
    const req = {
      user: { id: 2, email: 'atendente@teste.com', perfil: 'Atendente' as const },
    } as Request;
    const res = mockRes();

    permit('Administrador')(req, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. Permissão insuficiente.' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
