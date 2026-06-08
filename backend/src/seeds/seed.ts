import bcrypt from 'bcryptjs';
import db from '../config/database';

function seed(): void {
  const adminEmail = 'admin@cartoflow.com';
  const atendenteEmail = 'atendente@cartoflow.com';

  const adminExiste = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (adminExiste) {
    console.log('Seed: dados já existem. Nenhuma alteração feita.');
    process.exit(0);
  }

  // Usuários
  const senhaAdmin = bcrypt.hashSync('123456', 10);
  const senhaAtendente = bcrypt.hashSync('123456', 10);

  db.prepare('INSERT INTO users (nome, email, senha, perfil) VALUES (?, ?, ?, ?)')
    .run('Carlos Administrador', adminEmail, senhaAdmin, 'Administrador');

  db.prepare('INSERT INTO users (nome, email, senha, perfil) VALUES (?, ?, ?, ?)')
    .run('Maria Atendente', atendenteEmail, senhaAtendente, 'Atendente');

  console.log('Usuários criados:');
  console.log('  [Administrador] admin@cartoflow.com / 123456');
  console.log('  [Atendente]     atendente@cartoflow.com / 123456');

  const servicos = [
    {
      tipo: 'Autenticação',
      nome_solicitante: 'João da Silva',
      cpf_solicitante: '123.456.789-00',
      descricao: 'Autenticação de cópia de RG e CPF',
      status: 'Concluído',
      data_solicitacao: '2026-05-20',
      observacoes: 'Entregue ao cliente',
    },
    {
      tipo: 'Certidão de Nascimento',
      nome_solicitante: 'Ana Paula Souza',
      cpf_solicitante: '987.654.321-00',
      descricao: 'Segunda via de certidão de nascimento',
      status: 'Em andamento',
      data_solicitacao: '2026-06-01',
      observacoes: 'Aguardando retorno do cartório de origem',
    },
    {
      tipo: 'Reconhecimento de Firma',
      nome_solicitante: 'Roberto Mendes',
      cpf_solicitante: '456.123.789-11',
      descricao: 'Reconhecimento de firma em contrato de compra e venda',
      status: 'Aguardando',
      data_solicitacao: '2026-06-03',
      observacoes: null,
    },
  ];

  const stmt = db.prepare(
    `INSERT INTO services (tipo, nome_solicitante, cpf_solicitante, descricao, status, data_solicitacao, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  for (const s of servicos) {
    stmt.run(s.tipo, s.nome_solicitante, s.cpf_solicitante, s.descricao, s.status, s.data_solicitacao, s.observacoes);
  }

  console.log('\nServiços de exemplo criados:');
  console.log('  [Concluído]    Autenticação — João da Silva');
  console.log('  [Em andamento] Certidão de Nascimento — Ana Paula Souza');
  console.log('  [Aguardando]   Reconhecimento de Firma — Roberto Mendes');
  console.log('\nSeed concluído com sucesso!');

  process.exit(0);
}

seed();
