## Instruções para Configuração e Teste Local do Aplicativo de Gestão de Antecipação

Olá!

Conforme solicitado, segue o projeto para que você possa configurá-lo e testá-lo em seu ambiente local. Abaixo estão os passos recomendados:

### Pré-requisitos:

1.  **Node.js e pnpm:** Certifique-se de ter o Node.js (versão 18 ou superior recomendada) e o `pnpm` instalados. Se não tiver o `pnpm`, você pode instalá-lo com `npm install -g pnpm`.
2.  **Wrangler CLI:** A ferramenta de linha de comando da Cloudflare, `wrangler`, é usada para gerenciar as migrações do banco de dados D1 (que usamos localmente via SQLite). Instale com `pnpm install -g wrangler`.

### Passos para Configuração:

1.  **Descompactar o Projeto:**
    *   Descompacte o arquivo `gestao-antecipacao-completo.zip` que enviei em um diretório de sua preferência.

2.  **Instalar Dependências:**
    *   Abra um terminal ou prompt de comando, navegue até o diretório raiz do projeto descompactado (onde está o arquivo `package.json`).
    *   Execute o comando: `pnpm install`
        *   Este comando instalará todas as dependências do projeto, incluindo Next.js, React, e as bibliotecas de banco de dados.

3.  **Configurar o Banco de Dados Local (SQLite via Wrangler D1):**
    *   O projeto está configurado para usar uma simulação local do banco de dados Cloudflare D1, que utiliza SQLite por baixo dos panos.
    *   **Aplicar Migrações:** Para criar a estrutura do banco de dados (tabelas, etc.), execute o seguinte comando no terminal, a partir da raiz do projeto:
        `pnpm run db:apply`
        *   Este comando usa o `wrangler` para aplicar os arquivos de migração SQL localizados na pasta `migrations` ao seu banco de dados SQLite local. O arquivo do banco de dados (`.sqlite`) será geralmente criado dentro de uma pasta `.wrangler` no diretório do projeto.

4.  **Iniciar o Servidor de Desenvolvimento:**
    *   Após instalar as dependências e aplicar as migrações, inicie o servidor de desenvolvimento do Next.js com o comando:
        `pnpm run dev`
    *   Por padrão, a aplicação deverá estar acessível em `http://localhost:3000` no seu navegador.

### Testando a Aplicação:

1.  **Acesso ao Login:**
    *   Acesse `http://localhost:3000/login`.
    *   As credenciais de administrador padrão, conforme criadas pelas migrações, são:
        *   **Email:** `admin@sistema.com`
        *   **Senha:** `admin123`

2.  **Funcionalidades para Testar (conforme `plano_de_testes.md` no projeto):
    *   Login e Logout.
    *   Criação, visualização, edição e exclusão de Clientes.
    *   Criação, visualização, edição e exclusão de Títulos (Boletos, Cheques).
    *   Criação e visualização de Operações de Antecipação.
    *   Fluxo de Recuperação de Senha (se implementado e funcional).
    *   Criação e gestão de Usuários (se a interface estiver disponível).

### Observações Importantes:

*   **Ambiente de Banco de Dados:** Lembre-se que este setup usa SQLite localmente como uma simulação do Cloudflare D1. O comportamento em produção no D1 real pode ter pequenas diferenças, mas para desenvolvimento e teste da lógica da aplicação, esta abordagem é bastante eficaz.
*   **Problemas com `sql.js` (Contexto):** Durante nosso desenvolvimento, tentamos usar `sql.js` para evitar problemas com bindings nativos de bibliotecas SQLite no ambiente de sandbox. O código atual do adaptador de banco de dados (`src/lib/db.ts`) está configurado para usar `sql.js`. Se você encontrar problemas com ele em seu ambiente local (o que é menos provável, mas possível dependendo da sua configuração Node.js/TypeScript), as versões anteriores do `db.ts` que usavam `better-sqlite3` ou `sqlite3` estão no histórico do nosso chat, caso precise reverter ou adaptar.
*   **Compilação TypeScript:** O projeto usa TypeScript. O comando `pnpm run dev` lida com a compilação em tempo de desenvolvimento.

Se encontrar qualquer dificuldade ou tiver dúvidas durante a configuração ou os testes, por favor, me avise!

Bons testes!
