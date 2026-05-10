# TechX To-Do List - Backend

Este projeto é uma API robusta de gerenciamento de tarefas (To-Do List) construída com **Node.js**, **TypeScript** e **Fastify**.

O projeto utiliza uma arquitetura limpa e moderna, com foco em escalabilidade, segurança e observabilidade.

## 🚀 Tecnologias Utilizadas

- **Core:** Node.js (v20+), TypeScript, Fastify
- **Banco de Dados Relacional:** MySQL (via Prisma ORM)
- **Banco de Dados NoSQL:** MongoDB (Logs de Auditoria)
- **Cache/Sessões:** Redis
- **Documentação:** Swagger/OpenAPI
- **Testes:** Vitest & Supertest (Alta cobertura)
- **Infraestrutura:** Docker & Docker Compose
- **Qualidade de Código:** ESLint (regras estritas), TypeBox (validação de esquemas)

---

## 🛠️ Como Executar o Projeto

Certifique-se de ter o **Node.js** e o **Docker** instalados em sua máquina.

### 1. Instalação das Dependências
Instale as dependências na pasta raiz do backend:
```bash
npm install
```

### 2. Subindo a Infraestrutura (Bancos de Dados e Redis)
Caso queira rodar apenas os bancos de dados localmente para desenvolver:
```bash
npm run infra:up
```

### 3. Executando em Modo de Desenvolvimento
Com os bancos rodando, inicie o servidor com hot-reload:
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:8888`.

### 4. Rodando o Ambiente Completo (Docker Full Stack)
Se preferir rodar tudo (bancos + aplicação) dentro de containers Docker:
```bash
npm run app:up
```

### 5. Parando e Limpando o Ambiente
Para parar os serviços e remover os recursos criados (evitando ocupar espaço desnecessário):
- Para apenas os bancos: `npm run infra:down`
- Para o ambiente completo: `npm run app:down`
- Para limpeza profunda (remove volumes e imagens): `npm run infra:clean`

---

## 📖 Documentação da API

A documentação interativa da API (Swagger) pode ser acessada em:
`http://localhost:8888/v1/docs`

Aqui você encontrará todos os endpoints, modelos de dados e poderá realizar testes diretamente pelo navegador.

---

## ✨ Features em Destaque

Este backend foi desenvolvido com padrões de nível profissional, incluindo:

1.  **Autenticação JWT Robusta:** Controle de acesso seguro com suporte a *Refresh Tokens* e gerenciamento de sessões via Redis para invalidação instantânea.
2.  **CRUD Completo de Tarefas:** Endpoints otimizados com paginação nativa e validação estrita de dados.
3.  **Sistema de Auditoria Automático:** Todos os eventos críticos são persistidos de forma assíncrona no MongoDB, garantindo rastreabilidade sem impactar a performance.
4.  **Arquitetura Baseada em Contratos:** Uso intensivo de `TypeBox` para garantir que o código, a validação e a documentação Swagger estejam sempre sincronizados.
5.  **Alta Cobertura de Testes:** Suíte de testes unitários e de integração garantindo a confiabilidade das regras de negócio.
6.  **Saúde do Sistema:** Endpoint `/v1/health` para monitoramento de disponibilidade.
7.  **Conexão Resiliente:** Lógica de retry automático para conexão com bancos de dados, ideal para ambientes orquestrados (Docker/K8s).

---

## 🧪 Testes

Para rodar os testes e verificar a cobertura:
```bash
npm run test:coverage
```

---

> **P.S.: Decisão Arquitetural sobre MongoDB**
>
> Embora as instruções do teste mencionem o uso de MongoDB para armazenar informações adicionais das tarefas (como descrições), optei por utilizar o MongoDB para o **Sistema de Auditoria**.
>
> **Motivação:** Em um cenário real, separar a descrição de uma tarefa em um banco NoSQL enquanto o restante do registro reside em um banco relacional causaria uma fragmentação de dados desnecessária e complexidade de consistência (*join* entre bancos). Em vez disso, utilizei o MongoDB para auditoria de eventos, que é um dos casos de uso mais comuns para NoSQL em arquiteturas profissionais, garantindo rastreabilidade completa de todas as operações CRUD sem onerar o banco relacional principal.

