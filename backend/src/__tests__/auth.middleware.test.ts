import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { mockRes } from './helpers/mockRes';

const mockNext = jest.fn() as NextFunction;

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 401 quando nenhum token é enviado', () => {
    const req = { headers: {} } as Request;
    const res = mockRes();

    authMiddleware(req, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido.' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retorna 401 quando o token enviado é inválido', () => {
    const req = {
      headers: { authorization: 'Bearer token_invalido_qualquer' },
    } as Request;
    const res = mockRes();

    authMiddleware(req, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
