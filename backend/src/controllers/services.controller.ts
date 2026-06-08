import { Request, Response } from 'express';
import db from '../config/database';

const TIPOS_VALIDOS = ['Certidão de Nascimento', 'Reconhecimento de Firma', 'Autenticação', 'Escritura', 'Outro'];
const STATUS_VALIDOS = ['Aguardando', 'Em andamento', 'Concluído'];

interface ServiceRow {
  id: number;
  tipo: string;
  nome_solicitante: string;
  cpf_solicitante: string;
  descricao: string | null;
  status: string;
  data_solicitacao: string;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export const ServicesController = {
  list(_req: Request, res: Response): void {
    const services = db
      .prepare('SELECT * FROM services ORDER BY id ASC')
      .all();
    res.json(services);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    const service = db
      .prepare('SELECT * FROM services WHERE id = ?')
      .get(id) as ServiceRow | undefined;

    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    res.json(service);
  },

  create(req: Request, res: Response): void {
    const { tipo, nome_solicitante, cpf_solicitante, descricao, status, data_solicitacao, observacoes } = req.body;

    if (!tipo || !nome_solicitante || !cpf_solicitante || !data_solicitacao) {
      res.status(400).json({ error: 'Campos obrigatórios: tipo, nome_solicitante, cpf_solicitante, data_solicitacao.' });
      return;
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
      res.status(400).json({ error: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.` });
      return;
    }

    const statusFinal = status && STATUS_VALIDOS.includes(status) ? status : 'Aguardando';

    const result = db
      .prepare(
        `INSERT INTO services (tipo, nome_solicitante, cpf_solicitante, descricao, status, data_solicitacao, observacoes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(tipo, nome_solicitante, cpf_solicitante, descricao ?? null, statusFinal, data_solicitacao, observacoes ?? null);

    const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newService);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const { tipo, nome_solicitante, cpf_solicitante, descricao, status, data_solicitacao, observacoes } = req.body;

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id) as ServiceRow | undefined;
    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    const novoTipo = tipo ?? service.tipo;
    const novoNome = nome_solicitante ?? service.nome_solicitante;
    const novoCpf = cpf_solicitante ?? service.cpf_solicitante;
    const novaDescricao = descricao !== undefined ? descricao : service.descricao;
    const novoStatus = status && STATUS_VALIDOS.includes(status) ? status : service.status;
    const novaData = data_solicitacao ?? service.data_solicitacao;
    const novasObs = observacoes !== undefined ? observacoes : service.observacoes;

    if (!TIPOS_VALIDOS.includes(novoTipo)) {
      res.status(400).json({ error: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.` });
      return;
    }

    db.prepare(
      `UPDATE services
       SET tipo = ?, nome_solicitante = ?, cpf_solicitante = ?, descricao = ?, status = ?,
           data_solicitacao = ?, observacoes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(novoTipo, novoNome, novoCpf, novaDescricao, novoStatus, novaData, novasObs, id);

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.json(updated);
  },

  remove(req: Request, res: Response): void {
    const { id } = req.params;

    const service = db.prepare('SELECT id FROM services WHERE id = ?').get(id);
    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.status(204).send();
  },
};
