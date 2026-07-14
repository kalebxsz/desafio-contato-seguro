# Contato Seguro - API de Triagem de Atendimentos

API desenvolvida para o Desafio Técnico da Contato Seguro. O objetivo é realizar a triagem automática de atendimentos, classificando-os em canais adequados e definindo uma prioridade com base no texto do ticket.

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Express** (Framework)
- **Prisma** (ORM)
- **PostgreSQL** (Base de dados)
- **Jest & Supertest** (Testes automatizados)
- **Docker Desktop** 

---

## Pré-requisitos

Certifique-se de ter instalado na sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [docker desktop](https://docs.docker.com/desktop/setup/install/windows-install/) crie um container `5432`

---

## Como rodar o projeto localmente

**1. Clone o repositório:**
```bash
git clone https://github.com/kalebxsz/desafio-contato-seguro.git
cd desafio-contato-seguro
2. Instale as dependências:

npm install
3. Configure o banco de dados e o arquivo(.env):

crie o arquivo docker-compose.yml e cole:
services:
  postgres:
    image: postgres:17

    container_name: contato_seguro

    restart: unless-stopped

    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: desafiojunior11
      POSTGRES_DB: projetoticket

    ports:
      - "5455:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:



Crie um arquivo .env na raiz do projeto e adicione a URL de conexão com o seu banco de dados PostgreSQL. Exemplo:

DATABASE_URL="postgresql://admin:desafiojunior11@localhost:5455/projetoticket?schema=public
PORT=3000

4. Rode as migrations do Prisma:
Isso criará as tabelas User e Ticket automaticamente no banco de dados:

Bash
npx prisma migrate dev


5. Inicie o servidor:
Bash
npm run dev
O servidor estará rodando em http://localhost:3000.

🧪 Como rodar os testes
A API possui testes unitários e de integração. Para rodá-los execute o comando:
Bash
npm run test

==============================================================================================================

Rotas e Exemplos de Requisição: normalmente será: http://localhost:3000
Health Check

GET /health
http://localhost:3000/health

Verifica se a API está online.
==============================================================================================================
Usuários: 
POST /users - Cria um novo usuário.
http://localhost:3000/users

Body JSON
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha_segura"
}
GET /users - Lista todos os usuários.
http://localhost:3000/users

GET /users/:id - Busca um usuário por ID.
http://localhost:3000/users/1

PUT /users/:id - Atualiza um usuário.
http://localhost:3000/users/1

DELETE /users/:id - Exclui um usuário.
http://localhost:3000/users/1
==============================================================================================================


Tickets
POST /tickets - Cria e classifica o ticket automaticamente.
http://localhost:3000/tickets/
body JSON
{
  "title": "Erro ao acessar plataforma",
  "description": "Estou com erro ao tentar logar na minha conta desde ontem.",
  "userId": 1
}
GET /tickets - Lista os tickets.
http://localhost:3000/tickets

GET /tickets/:id - Busca um ticket por ID.
http://localhost:3000/tickets/1

PATCH /tickets/:id/status - Atualiza o status do ticket.
http://localhost:3000/tickets/1/status
body JSON
{
  "status": "EM_ANDAMENTO"


}


==============================================================================================================
                                    Desenvolvido por Kaleb Canabarro
==============================================================================================================