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

### Autenticação

#### Registrar Novo Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}

Response 201:
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "nivel": 1,
  "xpAtual": 0,
  "coins": 0,
  "avatarAtualId": null,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}

Response 200:
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "nivel": 5,
  "xpAtual": 350,
  "coins": 450,
  "avatarAtualId": 3,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Atualizar Perfil 🔒
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Pedro Silva",
  "email": "joaopedro@email.com",
  "senha": "novaSenha123" // opcional
}

Response 200:
{
  "id": 1,
  "nome": "João Pedro Silva",
  "email": "joaopedro@email.com",
  "nivel": 5,
  "xpAtual": 350,
  "coins": 450
}
```

#### Obter Estatísticas 🔒
```http
GET /auth/stats
Authorization: Bearer {token}

Response 200:
{
  "totalMetas": 15,
  "metasConcluidas": 8,
  "metasExpiradas": 2,
  "metasEmAndamento": 5,
  "metasPendentes": 0
}
```

#### Selecionar Avatar 🔒
```http
PUT /auth/avatar/select
Authorization: Bearer {token}
Content-Type: application/json

{
  "avatarId": 3
}

Response 200:
{
  "message": "Avatar selecionado com sucesso"
}
```

### Metas

#### Listar Metas 🔒
```http
GET /meta/list?page=1&status=EM_ANDAMENTO&orderBy=dataFim
Authorization: Bearer {token}

Query Parameters:
- page: número da página (default: 1)
- status: PENDENTE | EM_ANDAMENTO | CONCLUIDA | EXPIRADA | ALL (default: ALL)
- orderBy: dataCriacao | dataFim | progresso | status (default: dataCriacao)

Response 200:
{
  "metas": [
    {
      "id": 1,
      "titulo": "Aprender Node.js",
      "descricao": "Dominar backend com JavaScript",
      "dataInicio": "2025-01-01",
      "dataFim": "2025-06-30",
      "status": "EM_ANDAMENTO",
      "progresso": 60,
      "totalTarefas": 10,
      "tarefasConcluidas": 6,
      "usuarioId": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

#### Obter Meta por ID 🔒
```http
GET /meta/:id
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "titulo": "Aprender Node.js",
  "descricao": "Dominar backend com JavaScript",
  "dataInicio": "2025-01-01",
  "dataFim": "2025-06-30",
  "status": "EM_ANDAMENTO",
  "progresso": 60,
  "totalTarefas": 10,
  "tarefasConcluidas": 6
}
```

#### Criar Meta 🔒
```http
POST /meta/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Ler 12 livros",
  "descricao": "Um livro por mês durante o ano",
  "dataInicio": "2025-01-01",
  "dataFim": "2025-12-31"
}

Response 201:
{
  "id": 2,
  "titulo": "Ler 12 livros",
  "descricao": "Um livro por mês durante o ano",
  "dataInicio": "2025-01-01",
  "dataFim": "2025-12-31",
  "status": "PENDENTE",
  "progresso": 0
}
```

#### Atualizar Meta 🔒
```http
PUT /meta/update/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Ler 15 livros",
  "descricao": "Aumentei a meta!",
  "dataInicio": "2025-01-01",
  "dataFim": "2025-12-31"
}

Response 200:
{
  "id": 2,
  "titulo": "Ler 15 livros",
  "descricao": "Aumentei a meta!",
  "status": "PENDENTE"
}
```

#### Concluir Meta 🔒
```http
PUT /meta/update/:id/conclude
Authorization: Bearer {token}

Response 200:
{
  "message": "Meta concluída com sucesso!",
  "recompensas": {
    "xp": 100,
    "coins": 100
  }
}
```

#### Excluir Meta 🔒
```http
DELETE /meta/delete/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Meta excluída com sucesso"
}
```

### Tarefas

#### Listar Tarefas de uma Meta 🔒
```http
GET /tarefa/:metaId/list
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "titulo": "Configurar ambiente Node.js",
    "prioridade": "ALTA",
    "concluida": true,
    "metaId": 1
  },
  {
    "id": 2,
    "titulo": "Estudar Express.js",
    "prioridade": "MEDIA",
    "concluida": false,
    "metaId": 1
  }
]
```

#### Criar Tarefa 🔒
```http
POST /tarefa/:metaId/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Aprender Sequelize ORM",
  "prioridade": "ALTA"
}

Response 201:
{
  "id": 3,
  "titulo": "Aprender Sequelize ORM",
  "prioridade": "ALTA",
  "concluida": false,
  "metaId": 1
}
```

#### Atualizar Tarefa 🔒
```http
PUT /tarefa/:metaId/update/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Dominar Sequelize ORM",
  "prioridade": "MEDIA"
}

Response 200:
{
  "id": 3,
  "titulo": "Dominar Sequelize ORM",
  "prioridade": "MEDIA",
  "concluida": false
}
```

#### Concluir Tarefa 🔒
```http
PUT /tarefa/:metaId/update/:id/conclude
Authorization: Bearer {token}

Response 200:
{
  "message": "Tarefa concluída com sucesso!",
  "recompensas": {
    "xp": 10,
    "coins": 10
  }
}
```

#### Excluir Tarefa 🔒
```http
DELETE /tarefa/:metaId/delete/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Tarefa excluída com sucesso"
}
```

### Recompensas

#### Listar Recompensas do Usuário 🔒
```http
GET /recompensa/list
Authorization: Bearer {token}

Response 200:
{
  "avatares": [
    {
      "id": 1,
      "nome": "Arqueiro Verde",
      "imagem": "arqueiro-verde.png",
      "preco": 100,
      "tipo": "AVATAR",
      "desbloqueado": true
    },
    {
      "id": 2,
      "nome": "Deadpool",
      "imagem": "deadpool.png",
      "preco": 200,
      "tipo": "AVATAR",
      "desbloqueado": false
    }
  ]
}
```

#### Comprar Avatar 🔒
```http
PUT /recompensa/buy/:avatarId
Authorization: Bearer {token}

Response 200:
{
  "message": "Avatar comprado com sucesso!",
  "avatar": {
    "id": 2,
    "nome": "Deadpool",
    "preco": 200
  },
  "coinsRestantes": 250
}

Response 400:
{
  "error": "Coins insuficientes"
}
```

#### Listar Todos os Emblemas 🔒
```http
GET /recompensa/emblemas/all
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "nome": "Primeira Meta",
    "descricao": "Crie sua primeira meta",
    "icone": "🎯",
    "tipo": "EMBLEMA",
    "desbloqueado": true
  },
  {
    "id": 2,
    "nome": "Mestre das Metas",
    "descricao": "Complete uma meta inteira",
    "icone": "🏆",
    "tipo": "EMBLEMA",
    "desbloqueado": false
  }
]
```

#### Listar Emblemas Desbloqueados 🔒
```http
GET /recompensa/emblemas/unlocked
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "nome": "Primeira Meta",
    "descricao": "Crie sua primeira meta",
    "icone": "🎯",
    "tipo": "EMBLEMA",
    "dataDesbloqueio": "2025-01-15T10:30:00.000Z"
  }
]
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

### Eventos WebSocket

#### USER_UPDATE
Enviado quando XP, nível ou coins do usuário são atualizados.

```json
{
  "type": "USER_UPDATE",
  "data": {
    "nivel": 5,
    "xpAtual": 350,
    "xpProximoNivel": 500,
    "coins": 450
  }
}
```

#### EMBLEMA_DESBLOQUEADO
Enviado quando um novo emblema é conquistado.

```json
{
  "type": "EMBLEMA_DESBLOQUEADO",
  "data": {
    "id": 3,
    "nome": "Guerreiro de Tarefas",
    "descricao": "Complete 10 tarefas",
    "icone": "⚔️"
  }
}
```

#### AVATAR_UNLOCKED
Enviado quando um avatar é comprado.

```json
{
  "type": "AVATAR_UNLOCKED",
  "data": {
    "id": 2,
    "nome": "Deadpool",
    "imagem": "deadpool.png"
  }
}
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
| Aranha Preto | 400 |
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

## 🗄️ Modelos do Banco de Dados

### Usuario
```javascript
{
  id: INTEGER (PK, Auto Increment),
  nome: STRING(100),
  email: STRING(255) UNIQUE,
  senha: STRING(255),
  nivel: INTEGER DEFAULT 1,
  xpAtual: INTEGER DEFAULT 0,
  coins: INTEGER DEFAULT 0,
  avatarAtualId: INTEGER (FK -> Recompensa)
}
```

### Meta
```javascript
{
  id: INTEGER (PK, Auto Increment),
  titulo: STRING(200),
  descricao: TEXT,
  dataInicio: DATE,
  dataFim: DATE,
  status: ENUM (PENDENTE, EM_ANDAMENTO, CONCLUIDA, EXPIRADA),
  usuarioId: INTEGER (FK -> Usuario)
}
```

### Tarefa
```javascript
{
  id: INTEGER (PK, Auto Increment),
  titulo: STRING(200),
  prioridade: ENUM (BAIXA, MEDIA, ALTA),
  concluida: BOOLEAN DEFAULT false,
  metaId: INTEGER (FK -> Meta)
}
```

### Recompensa
```javascript
{
  id: INTEGER (PK, Auto Increment),
  nome: STRING(100),
  descricao: TEXT,
  imagem: STRING(255),
  icone: STRING(10),
  preco: INTEGER,
  tipo: ENUM (AVATAR, EMBLEMA)
}
```

### UsuarioRecompensa (Join Table)
```javascript
{
  usuarioId: INTEGER (FK -> Usuario),
  recompensaId: INTEGER (FK -> Recompensa),
  dataDesbloqueio: DATE DEFAULT NOW
}
```

### Relacionamentos

```
Usuario (1) ─── (N) Meta
Meta (1) ─── (N) Tarefa
Usuario (N) ─── (N) Recompensa
```

## 📊 Enums

### StatusEnum
```javascript
{
  PENDENTE: 'PENDENTE',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  EXPIRADA: 'EXPIRADA'
}
```

### PrioridadeEnum
```javascript
{
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA'
}
```

### TipoRecompensaEnum
```javascript
{
  AVATAR: 'AVATAR',
  EMBLEMA: 'EMBLEMA'
}
```

## 🧪 Testando a API

### Usando cURL

```bash
# Registrar usuário
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@email.com",
    "senha": "123456"
  }'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "senha": "123456"
  }'

# Criar meta (substitua {TOKEN} pelo token recebido)
curl -X POST http://localhost:8080/meta/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "titulo": "Minha Meta",
    "descricao": "Descrição da meta",
    "dataInicio": "2025-01-01",
    "dataFim": "2025-12-31"
  }'
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

### 🚧 Melhorias Futuras

- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Documentação com Swagger
- [ ] Rate limiting
- [ ] Logging estruturado (Winston)
- [ ] Validação com Joi/Yup
- [ ] Sistema de notificações por email
- [ ] Upload de imagens customizadas
- [ ] API de análise e relatórios
- [ ] Cache com Redis
- [ ] Migrações com Sequelize CLI
- [ ] Docker e Docker Compose
- [ ] CI/CD pipeline
- [ ] Monitoramento (Prometheus/Grafana)

## 🐛 Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Códigos HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Requisição inválida
- **401** - Não autenticado
- **403** - Sem permissão
- **404** - Não encontrado
- **500** - Erro interno do servidor

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

## 📄 Licença

Este projeto é um trabalho acadêmico desenvolvido para fins educacionais.

## 🔗 Links Relacionados

- **Frontend**: [TaskHero App](../app-taskhero/README.md)
- **Repositório**: GitHub (link do repositório)

---

**TaskHero API** - Backend robusto para transformar metas em conquistas! 🚀🎯
