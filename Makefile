.PHONY: setup infra dev stop test coverage clean infra-clean help

# Cores para o terminal
BLUE = \033[0;34m
GREEN = \033[0;32m
NC = \033[0m # No Color

help:
	@echo "$(BLUE)Comandos disponíveis:$(NC)"
	@echo "  $(GREEN)make setup$(NC)       - Instala dependências no backend e frontend"
	@echo "  $(GREEN)make infra$(NC)       - Sobe os bancos de dados e redis (Docker)"
	@echo "  $(GREEN)make dev$(NC)         - Inicia backend e frontend em paralelo"
	@echo "  $(GREEN)make stop$(NC)        - Para a infraestrutura e processos em background"
	@echo "  $(GREEN)make test$(NC)        - Roda os testes (Single Run)"
	@echo "  $(GREEN)make coverage$(NC)    - Roda os testes com relatório de cobertura"
	@echo "  $(GREEN)make infra-clean$(NC) - Remove containers, volumes e IMAGENS do Docker"
	@echo "  $(GREEN)make clean$(NC)       - Limpeza completa (Docker + dist + node_modules)"

setup:
	@echo "$(BLUE)Instalando dependências do Backend...$(NC)"
	cd backend && npm install
	@echo "$(BLUE)Instalando dependências do Frontend...$(NC)"
	cd frontend && npm install

infra:
	@echo "$(BLUE)Subindo infraestrutura via Docker...$(NC)"
	cd backend && npm run infra:up

dev:
	@echo "$(BLUE)Iniciando ambiente de desenvolvimento (Ctrl+C para parar)...$(NC)"
	@(trap 'kill 0' SIGINT; \
	cd backend && npm run dev & \
	cd frontend && npm run dev & \
	wait)

stop:
	@echo "$(BLUE)Parando infraestrutura...$(NC)"
	cd backend && npm run infra:down
	@echo "$(BLUE)Encerrando processos remanescentes...$(NC)"
	-pkill -f "tsx src/app.ts"
	-pkill -f "ng serve"

test:
	@echo "$(BLUE)Rodando testes do Backend...$(NC)"
	cd backend && npm run test -- --run
	@echo "$(BLUE)Rodando testes do Frontend...$(NC)"
	cd frontend && npm run test -- --watch=false

coverage:
	@echo "$(BLUE)Gerando cobertura do Backend...$(NC)"
	cd backend && npm run test:coverage
	@echo "$(BLUE)Gerando cobertura do Frontend...$(NC)"
	cd frontend && npm run test:coverage

infra-clean:
	@echo "$(BLUE)Removendo containers, volumes e imagens de infraestrutura...$(NC)"
	cd backend && npm run infra:clean

clean: infra-clean
	@echo "$(BLUE)Limpando pastas dist e node_modules...$(NC)"
	rm -rf backend/dist frontend/dist backend/node_modules frontend/node_modules
