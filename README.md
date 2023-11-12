# Vagou Aqui App

Bem-vindo ao Vagou Aqui App, uma aplicação web desenvolvida para auxiliar na busca e recomendação de anúncios imobiliários.

## Visão Geral

Este projeto é uma aplicação de página única (SPA) que utiliza a stack MERN (MongoDB, Express.js, React.js, Node.js) para criar uma plataforma para busca e recomendação de anúncios imobiliários.

## Estrutura do Diretório

A estrutura do diretório é organizada em duas partes principais: `client` (lado do cliente) e `server` (lado do servidor). Aqui está uma visão geral da estrutura do diretório:

|--- client 
|--- server
|--- LICENSE.md
|--- README.md


Para mais detalhes sobre a estrutura do diretório, consulte o README.md nos diretórios `client` e `server`.

## Configuração e Execução

Siga as instruções abaixo para configurar e executar a aplicação:

1. **Instalação de Dependências:**
    - No diretório `client` do projeto, execute `npm install` para instalar as dependências do cliente.
    - Em seguida, vá para o diretório `server` e execute `npm install` para instalar as dependências do servidor.

2. **Configuração do Banco de Dados:**
    - Crie um banco de dados com o o nome `VagouAqui` no mongoDB
    - Crie um arquivo `.env` no diretório `server` e preencha-o com as informações necessárias. Exemplo:

      ```env
      MONGODB_URI=
      PORT=
      LAST_SCRAPING_DATE=
      ```
    - Insira a string de conexão na variável `MONGODB_URI=`.
    - Insira o valor da porta do sevidor na variável `PORT` (sugestão `5000`)
    - LAST_SCRAPING_DATE fica vazio porque será preenchido quando os anúncios forem raspados.
   
3. **Execução:**
    - No diretório `server` do projeto, execute `npm run server` para iniciar o servidor da aplicação.
    - No diretório `client` do projeto, execute `npm run client` para iniciar o cliente da aplicação.
    - Acesse `http://localhost:3000/` para acessar a aplicação


## Rotas do Servidor

### Anúncios

- **GET /api/ads/all:** Obtém todos os anúncios.
- **GET /api/ads/lastScrapingDate:** Obtém a data da última extração.

### Recomendações

- **GET /api/recommendations/all:** Obtém recomendações de anúncios baseadas em conteúdo para um usuário autenticado.

### Usuários

- **POST /api/users/register:** Registra um novo usuário.
- **POST /api/users/login:** Loga um usuário e retorna um token JWT.
- **PUT /api/users/preferences:** Atualiza as preferências do usuário autenticado.
- **GET /api/users/preferences:** Obtém as preferências do usuário autenticado.
- **GET /api/users/me:** Obtém as informações do usuário autenticado.
- **DELETE /api/users/delete:** Exclui a conta do usuário autenticado.

## Scripts Disponíveis para o cliente

- `npm run dev`: Inicia o servidor e o cliente em modo de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm start`: Inicia o servidor em modo de produção.
- `npm run client`: Inicia o servidor.


## Licença

Este projeto é licenciado sob a Licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para obter detalhes.

## Autor

**Jose Ribamar Marcal Martins Junior**

