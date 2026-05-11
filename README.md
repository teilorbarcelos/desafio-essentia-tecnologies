# TechX To-Do List - Monorepo

Este repositório contém a solução completa para o desafio **TechX To-Do List**, composta por um backend robusto em Node.js e um frontend moderno em Angular.

A aplicação permite que os usuários gerenciem suas tarefas diárias com segurança, performance e uma experiência de usuário premium.

---

## 🏗️ Arquitetura do Projeto

O projeto está dividido em duas partes principais:

### [Backend](./backend)
- **Tecnologias:** Node.js, Fastify, TypeScript, Prisma (MySQL), MongoDB, Redis.
- **Destaques:** Autenticação JWT com Refresh Tokens, Sistema de Auditoria assíncrono no MongoDB, Documentação Swagger automática e 100% de cobertura de testes nos módulos principais.

### [Frontend](./frontend)
- **Tecnologias:** Angular 21, Signals, Tailwind CSS, Lucide Icons, Vitest.
- **Destaques:** Interface responsiva e animada, gerenciamento de estado reativo com Signals, Interceptors para Auth e Silent Refresh, e 100% de cobertura de testes em componentes compartilhados.

---

## 🛠️ Pré-requisitos

- **Node.js** (v20 ou superior)
- **Docker** e **Docker Compose**
- **Make** (opcional, mas recomendado para usar os comandos simplificados)

---

## 🚀 Como Iniciar

A maneira mais fácil de gerenciar o projeto é através do **Makefile** na raiz.

### 1. Setup Inicial
Instala as dependências de ambos os projetos de uma só vez:
```bash
make setup
```

### 2. Iniciar Infraestrutura
Sobe os bancos de dados (MySQL, MongoDB) e o Redis via Docker:
```bash
make infra
```

### 3. Executar em Desenvolvimento
Inicia o backend e o frontend simultaneamente:
```bash
make dev
```
- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:8888`
- **Documentação API (Swagger):** `http://localhost:8888/v1/docs`

---

## 📋 Comandos Disponíveis (Makefile)

| Comando | Descrição |
| :--- | :--- |
| `make setup` | Instala dependências em ambos os projetos (`npm install`) |
| `make infra` | Sobe a infraestrutura de bancos (Docker Compose) |
| `make dev` | Executa backend e frontend em modo de desenvolvimento |
| `make test` | Executa todos os testes (Backend e Frontend) |
| `make stop` | Para todos os serviços e bancos |
| `make clean` | Remove containers, volumes e limpa caches do ambiente |

---

## 🧪 Qualidade e Testes

Ambos os projetos possuem suítes de testes rigorosas. Você pode rodar todos os testes do monorepo com:
```bash
make test
```
Ou individualmente entrando em cada pasta e rodando `npm run test:coverage`.

---

## 👤 Usuário Padrão (Seed)

Ao subir o backend pela primeira vez, um usuário padrão é criado automaticamente:
- **Email:** `admin@email.com`
- **Senha:** `admin@123`

---

Desenvolvido com ❤️ como parte de um desafio técnico para a Essentia.
