# CartoFlow

Aplicação full-stack para gerenciamento de serviços de cartório, composta por um backend em Node.js/Express e um frontend em React.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

---

## Estrutura do Projeto

```
cartoflow/
├── backend/    # API REST (Node.js + Express + SQLite)
└── frontend/   # Interface web (React + Vite)
```

---

## Configuração do Backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
PORT=3333
JWT_SECRET=cartoflow_secret_key
DATABASE_PATH=./database.sqlite
```

### 3. Popular o banco de dados

```bash
npm run seed
Verifique/visualize as credenciais criadas já existentes no arquivo "database.sqlite". (Necessária a extensão SQLite Viewer):
Login: admin@cartoflow.com e atendente@cartoflow.com
Senha geral: 123456
```

### 4. Iniciar em modo desenvolvimento

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3333`.

### Scripts disponíveis (Backend)

| Comando           | Descrição                                      |
|-------------------|------------------------------------------------|
| `npm run dev`     | Inicia o servidor em modo desenvolvimento      |
| `npm run build`   | Compila o TypeScript para JavaScript (`dist/`) |
| `npm run start`   | Inicia o servidor a partir do build compilado  |
| `npm run seed`    | Popula o banco de dados com dados iniciais     |
| `npm run test`    | Executa os testes                              |
| `npm run test:watch` | Executa os testes em modo watch            |

---

## Configuração do Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Iniciar em modo desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### Scripts disponíveis (Frontend)

| Comando              | Descrição                                  |
|----------------------|--------------------------------------------|
| `npm run dev`        | Inicia o servidor de desenvolvimento Vite  |
| `npm run build`      | Gera o build de produção                   |
| `npm run preview`    | Visualiza o build de produção localmente   |
| `npm run test`       | Executa os testes com Vitest               |
| `npm run test:watch` | Executa os testes em modo watch            |

---

## Rodando o Projeto Completo

Abra dois terminais e execute:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Bibliotecas Utilizadas

### Backend — Produção

| Biblioteca       | Versão   | Descrição                                        |
|------------------|----------|--------------------------------------------------|
| `express`        | ^5.2.1   | Framework web para criação da API REST           |
| `better-sqlite3` | ^12.10.0 | Driver SQLite síncrono e de alta performance     |
| `bcryptjs`       | ^3.0.3   | Hash e verificação de senhas                     |
| `jsonwebtoken`   | ^9.0.3   | Geração e validação de tokens JWT                |
| `cors`           | ^2.8.6   | Middleware para habilitar CORS na API            |
| `dotenv`         | ^17.4.2  | Carregamento de variáveis de ambiente via `.env` |

### Backend — Desenvolvimento / Testes

| Biblioteca      | Versão   | Descrição                                          |
|-----------------|----------|----------------------------------------------------|
| `typescript`    | ^6.0.3   | Superset tipado do JavaScript                      |
| `ts-node-dev`   | ^2.0.0   | Recarregamento automático em desenvolvimento       |
| `jest`          | ^29.7.0  | Framework de testes                                |
| `ts-jest`       | ^29.4.11 | Integração do Jest com TypeScript                  |
| `@types/*`      | variados | Tipagens TypeScript para as bibliotecas utilizadas |

---

### Frontend — Produção

| Biblioteca              | Versão   | Descrição                                              |
|-------------------------|----------|--------------------------------------------------------|
| `react`                 | ^18.3.1  | Biblioteca para construção de interfaces               |
| `react-dom`             | ^18.3.1  | Renderizador do React para o navegador                 |
| `react-router-dom`      | ^6.30.1  | Roteamento declarativo para aplicações React           |
| `@mui/material`         | ^6.4.8   | Componentes de UI seguindo o Material Design           |
| `@mui/icons-material`   | ^6.4.8   | Ícones do Material Design para React                   |
| `@emotion/react`        | ^11.14.0 | Engine de CSS-in-JS (dependência do MUI)               |
| `@emotion/styled`       | ^11.14.0 | API de componentes estilizados para Emotion            |
| `axios`                 | ^1.9.0   | Cliente HTTP para comunicação com a API                |
| `react-hook-form`       | ^7.56.4  | Gerenciamento de formulários com performance otimizada |
| `@hookform/resolvers`   | ^5.0.1   | Integração do React Hook Form com validadores          |
| `yup`                   | ^1.6.1   | Schema de validação para formulários                   |

### Frontend — Desenvolvimento / Testes

| Biblioteca                  | Versão   | Descrição                                        |
|-----------------------------|----------|--------------------------------------------------|
| `vite`                      | ^6.3.5   | Bundler e servidor de desenvolvimento            |
| `vitest`                    | ^4.1.8   | Framework de testes compatível com Vite          |
| `typescript`                | ~5.8.3   | Superset tipado do JavaScript                    |
| `@vitejs/plugin-react`      | ^4.5.2   | Plugin Vite para suporte ao React                |
| `@testing-library/react`    | ^16.3.2  | Utilitários para testes de componentes React     |
| `@testing-library/jest-dom` | ^6.9.1   | Matchers customizados para DOM no Jest/Vitest    |
| `@testing-library/user-event` | ^14.6.1 | Simulação de eventos de usuário em testes      |
| `jsdom`                     | ^29.1.1  | Implementação do DOM para ambiente de testes     |
