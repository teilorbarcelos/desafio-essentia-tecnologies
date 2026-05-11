# TechX To-Do List - Frontend

Este é o frontend da aplicação **TechX To-Do List**, uma plataforma moderna e responsiva para gerenciamento de tarefas, construída com **Angular (v21)** e focada em uma experiência de usuário premium.

O projeto segue as melhores práticas de desenvolvimento, utilizando **Signals** para gerenciamento de estado reativo, **Tailwind CSS** para estilização e uma suíte de testes robusta com **Vitest**.

---

## 🚀 Tecnologias Utilizadas

- **Core:** Angular 21 (Signals, Standalone Components, Control Flow)
- **Estilização:** Tailwind CSS (Modern UI/UX)
- **Ícones:** Lucide Angular
- **Gerenciamento de Estado:** Angular Signals (Reatividade nativa e performática)
- **Comunicação:** HttpClient com Interceptors (Auth & Silent Refresh)
- **Testes:** Vitest & @angular/build:unit-test (Alta cobertura)
- **Qualidade de Código:** TypeScript (Modo estrito), Prettier

---

## 🛠️ Como Executar o Projeto

Certifique-se de ter o **Node.js** instalado (recomenda-se v20+).

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Executando em Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

### 3. Build de Produção
```bash
npm run build
```
Os artefatos otimizados serão gerados na pasta `dist/`.

---

## ✨ Features em Destaque

Este frontend foi desenvolvido com padrões de engenharia de software de alto nível:

1.  **UX/UI Premium:** Design responsivo com animações suaves, feedback visual via Toasts e estados de carregamento (Skeletons/Spinners).
2.  **Silent Refresh:** Implementação de interceptor resiliente para renovação automática de tokens, garantindo que o usuário nunca seja deslogado enquanto estiver ativo.
3.  **Arquitetura Baseada em Features:** Organização modular por domínios (`auth`, `task`, `profile`), facilitando a manutenção e escalabilidade.
4.  **Shared Components Robustos:** Componentes altamente reutilizáveis e desacoplados, como o `ListPageController` que centraliza lógica de paginação, busca e filtros.
5.  **Alta Cobertura de Testes:** **100% de cobertura de linhas** nos componentes compartilhados e serviços críticos, garantindo estabilidade em cada deploy.
6.  **Organização de Testes:** Todos os testes unitários (`.spec.ts`) estão centralizados na pasta `src/test`, mantendo a pasta `src/app` limpa e focada no código de produção.

---

## 🧪 Testes e Qualidade

Para rodar a suíte completa de testes e verificar o relatório de cobertura:
```bash
npm run test:coverage
```

A cobertura foca em:
- **Services:** Lógica de negócio e integração com API.
- **Components:** Comportamento visual, emissão de eventos e renderização condicional.
- **Utils:** Funções auxiliares e controllers de listagem.

---

## 📂 Estrutura de Pastas

```text
src/
├── app/               # Código fonte da aplicação
│   ├── core/          # Serviços globais, interceptors e utilitários
│   ├── features/      # Módulos de funcionalidade (Auth, Task, Profile)
│   ├── shared/        # Componentes e layouts reutilizáveis
├── test/              # Suíte de testes espelhada à estrutura do app
└── assets/            # Arquivos estáticos e globais
```

---

> **Nota sobre a Experiência do Usuário**
>
> Cada detalhe da interface foi pensado para ser "vivo". Utilizamos micro-animações do Tailwind e ícones da Lucide para que a plataforma não seja apenas funcional, mas também prazerosa de usar.
