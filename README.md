# TaskHero API 🚀

API REST completa para gerenciamento de metas e tarefas com sistema avançado de gamificação, desenvolvida com Node.js e Express. Suporta autenticação JWT, WebSocket para atualizações em tempo real e um robusto sistema de recompensas.

## 📋 Sobre o Projeto

TaskHero API é o backend que alimenta o aplicativo móvel TaskHero, fornecendo uma arquitetura escalável e segura para gerenciar metas, tarefas, usuários e todo o sistema de gamificação.

### Funcionalidades Principais

- 🔐 **Autenticação JWT**: Sistema seguro com tokens de acesso
- 🔒 **Criptografia de Senhas**: Hash com Bcrypt (10 rounds)
- 🎯 **Gestão de Metas**: CRUD completo com validações
- ✅ **Sistema de Tarefas**: Prioridades e acompanhamento de progresso
- 🎮 **Gamificação**: XP, níveis, TaskCoins e emblemas
- 👤 **Avatares Personalizáveis**: 10 avatares temáticos
- 🏆 **8 Emblemas**: Sistema de conquistas automático
- 📡 **WebSocket**: Comunicação em tempo real
- 🗄️ **PostgreSQL**: Banco de dados robusto com Sequelize ORM
- 📊 **Estatísticas**: Tracking completo de performance do usuário

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 18+
- **Framework**: Express.js v5.1.0
- **ORM**: Sequelize v6.37.7
- **Banco de Dados**: PostgreSQL 14+
- **Autenticação**: JWT (jsonwebtoken v9.0.2)
- **Segurança**: Bcrypt v6.0.0
- **WebSocket**: ws v8.18.3
- **Ambiente**: dotenv v17.2.2
- **Dev**: Nodemon v3.1.10

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas para separação de responsabilidades:

```
src/
├── controller/          # Camada de apresentação (requisições HTTP)
├── services/           # Lógica de negócio
├── repository/         # Camada de dados (acesso ao BD)
├── models/            # Modelos Sequelize (entidades)
├── routers/           # Definição de rotas
├── middlewares/       # Interceptadores (autenticação)
├── enums/            # Enumerações e constantes
├── utils/            # Utilitários
└── websocket/        # Servidor WebSocket
```

### Fluxo de Requisição
```
Cliente → Router → Middleware (Auth) → Controller → Service → Repository → Database
                                                        ↓
                                         WebSocket ← Notificação
```

## 📂 Estrutura Detalhada

```
api-taskhero/
├── .env                           # Variáveis de ambiente (não versionado)
├── .env.example                   # Exemplo de configuração
├── .gitignore                     # Arquivos ignorados pelo Git
├── package.json                   # Dependências e scripts
├── README.md                      # Documentação
│
├── migrations/                    # Seeds do banco de dados
│   ├── run-seed.js               # Script para executar seeds
│   ├── seed-avatares.js          # Popula tabela de avatares
│   └── seed-emblemas.js          # Popula tabela de emblemas
│
└── src/                          # Código fonte
    ├── index.js                  # Entrada da aplicação
    ├── db.js                     # Configuração do banco
    │
    ├── controller/               # Controllers (requisições HTTP)
    │   ├── AuthController.js     # Autenticação e perfil
    │   ├── MetaController.js     # Gerenciamento de metas
    │   ├── TarefaController.js   # Gerenciamento de tarefas
    │   └── RecompensaController.js # Recompensas e avatares
    │
    ├── services/                 # Lógica de negócio
    │   ├── UsuarioService.js     # Regras de usuários
    │   ├── MetaService.js        # Regras de metas
    │   ├── TarefaService.js      # Regras de tarefas
    │   └── RecompensaService.js  # Sistema de gamificação
    │
    ├── repository/               # Acesso ao banco de dados
    │   ├── UsuarioRepository.js  # Queries de usuários
    │   ├── MetaRepository.js     # Queries de metas
    │   └── TarefaRepository.js   # Queries de tarefas
    │
    ├── models/                   # Modelos Sequelize
    │   ├── index.js             # Configuração e relacionamentos
    │   ├── Usuario.js           # Modelo de usuário
    │   ├── Meta.js              # Modelo de meta
    │   ├── Tarefa.js            # Modelo de tarefa
    │   └── Recompensa.js        # Modelo de recompensa
    │
    ├── routers/                  # Definição de rotas
    │   ├── index.js             # Agregador de rotas
    │   ├── AuthRouter.js        # Rotas de autenticação
    │   ├── MetaRouter.js        # Rotas de metas
    │   ├── TarefaRouter.js      # Rotas de tarefas
    │   └── RecompensaRouter.js  # Rotas de recompensas
    │
    ├── middlewares/              # Middlewares
    │   └── Auth.js              # Verificação de JWT
    │
    ├── enums/                    # Enumerações
    │   ├── StatusEnum.js        # Status de metas
    │   ├── PrioridadeEnum.js    # Níveis de prioridade
    │   └── TipoRecompensaEnum.js # Tipos de recompensa
    │
    ├── utils/                    # Utilitários
    │   └── ObjectUtils.js       # Transformações de objetos
    │
    └── websocket/                # WebSocket
        └── websocket.js         # Servidor e eventos WS
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- npm ou yarn

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd api-taskhero
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskhero
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Segurança
JWT_SECRET=sua_chave_secreta_super_segura_aqui
SALT_ROUNDS=10
```

### 4. Criar o Banco de Dados

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE taskhero;
```

### 5. Executar as Migrations (Seeds)

```bash
# Popular avatares e emblemas
node migrations/run-seed.js
```

### 6. Iniciar o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:8080` 🎉

## 📡 API Endpoints

### Base URL
```
http://localhost:8080
```

## 🔌 WebSocket

### Conectar ao WebSocket

```javascript
const ws = new WebSocket('ws://localhost:8080?userId=1');

ws.onopen = () => {
  console.log('Conectado ao servidor');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Mensagem recebida:', data);
};
```

## 🎮 Sistema de Gamificação

### Cálculo de XP e Níveis

```javascript
// XP necessário para próximo nível
xpProximoNivel = 100 * nivelAtual

// Exemplo:
// Nível 1 → 2: 100 XP
// Nível 2 → 3: 200 XP
// Nível 5 → 6: 500 XP
```

### Recompensas por Ação

| Ação | XP | Coins |
|------|-------|-------|
| ✅ Tarefa concluída | +10 | +10 |
| 🎯 Meta concluída (no prazo) | +100 | +100 |
| ⏰ Meta concluída (atrasada) | 0 | +50 |

### Emblemas e Condições

1. **🎯 Primeira Meta** - Criar primeira meta
2. **🏆 Mestre das Metas** - Completar uma meta
3. **⚔️ Guerreiro de Tarefas** - Completar 10 tarefas
4. **👑 Campeão das Tarefas** - Completar 50 tarefas
5. **📈 Ascendente** - Alcançar nível 5
6. **⭐ Lendário** - Alcançar nível 10
7. **🌅 Madrugador** - Completar tarefa antes das 8h
8. **🦉 Coruja Noturna** - Completar tarefa após 22h

### Avatares e Preços

| Avatar | Preço (Coins) |
|--------|---------------|
| Arqueiro Verde | 100 |
| Deadpool | 200 |
| Invencível | 200 |
| Flash | 350 |
| Aranha Venom | 350 |
| Homem-Aranha | 400 |
| Miles Morales | 400 |
| Kratos | 500 |
| Demolidor | 1000 |
| Batman | 1000 |

## 🔒 Segurança

### Autenticação JWT

- Token gerado no login/registro
- Expiração: 4 horas
- Header: `Authorization: Bearer {token}`
- Middleware verifica token em rotas protegidas

### Proteção de Senha

```javascript
// Hash com Bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(senha, 10);

// Comparação
const isValid = await bcrypt.compare(senhaFornecida, senhaHash);
```

### CORS

```javascript
// Configurado para aceitar qualquer origem (desenvolvimento)
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

### Usando Postman/Insomnia

1. Importe a collection (se disponível)
2. Configure a variável `{{baseUrl}}` = `http://localhost:8080`
3. Após login, salve o token na variável `{{token}}`
4. Use `Bearer {{token}}` no header Authorization

## 🚦 Status da API

### ✅ Implementado

- [x] Autenticação completa (register, login, JWT)
- [x] CRUD de metas com filtros e paginação
- [x] CRUD de tarefas com prioridades
- [x] Sistema de gamificação (XP, níveis, coins)
- [x] Sistema de emblemas automático
- [x] Loja de avatares funcional
- [x] WebSocket para notificações em tempo real
- [x] Estatísticas do usuário
- [x] Atualização de perfil
- [x] Validações de negócio
- [x] Tratamento de erros
- [x] Seeds para dados iniciais
- [x] CORS configurado

## 📝 Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",    // Desenvolvimento com hot reload
    "start": "node src/index.js"       // Produção
  }
}
```

## 🔧 Configuração do Banco

### Sequelize Sync

```javascript
// Sincroniza modelos com o banco
await db.seq.sync({ alter: true }); // Desenvolvimento
await db.seq.sync({ force: true }); // CUIDADO: Apaga tudo
```

### Executar Seeds

```bash
node migrations/run-seed.js
```

## 🌐 Deployment

### Variáveis de Ambiente (Produção)

```bash
DB_HOST=seu-servidor-postgres.com
DB_PORT=5432
DB_NAME=taskhero_production
DB_USER=usuario_producao
DB_PASSWORD=senha_super_segura
JWT_SECRET=chave_jwt_muito_segura_e_aleatoria
SALT_ROUNDS=10
NODE_ENV=production
PORT=8080
```

### Recomendações

1. **Não use** `sync({ alter: true })` em produção
2. Use variáveis de ambiente para configurações sensíveis
3. Configure um proxy reverso (Nginx)
4. Use HTTPS em produção
5. Configure logging adequado
6. Monitore a aplicação
7. Faça backups regulares do banco

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido como parte do trabalho acadêmico A3 - 2025.

### Tecnologias e Conceitos Aplicados

- ✅ Node.js e Express.js
- ✅ PostgreSQL e Sequelize ORM
- ✅ Autenticação JWT
- ✅ WebSocket para tempo real
- ✅ Clean Architecture (Camadas)
- ✅ RESTful API Design
- ✅ Segurança (Bcrypt, JWT)
- ✅ Gamificação Backend
- ✅ Sistema de recompensas

## 🔗 Links Relacionados

- **Frontend**: TaskHero App
- **Repositório**: [Aplicativo](https://github.com/GustavoSilles/app-taskhero)
- **Worker**: Sistema Notificador
- **Repositório**: [Notificador](https://github.com/GabrielFMeira/notificator-taskhero)

---

**TaskHero API** - Backend robusto para transformar metas em conquistas! 🚀🎯
