# Guia de Implantação do Aplicativo na Vercel

Este guia detalhado irá ajudá-lo a implantar seu aplicativo de Gestão de Antecipação de Recebíveis na Vercel, passo a passo.

## Pré-requisitos

- Conta Vercel (já criada com o email alfredograbarz@gmail.com)
- Conta GitHub (se ainda não tiver, será necessário criar uma)

## Etapa 1: Criar uma conta GitHub (se necessário)

1. Acesse [GitHub.com](https://github.com)
2. Clique em "Sign up" no canto superior direito
3. Siga as instruções para criar sua conta
4. Verifique seu email e confirme a conta

## Etapa 2: Criar um novo repositório no GitHub

1. Após fazer login no GitHub, clique no botão "+" no canto superior direito
2. Selecione "New repository"
3. Dê um nome ao repositório (por exemplo, "gestao-antecipacao")
4. Deixe o repositório como "Public"
5. Não inicialize o repositório com README, .gitignore ou licença
6. Clique em "Create repository"

## Etapa 3: Fazer upload do código para o GitHub

Após criar o repositório, você verá uma página com instruções. Você precisará fazer upload do código que preparei para você. Existem duas maneiras de fazer isso:

### Opção 1: Upload via interface web (mais fácil)

1. No seu novo repositório GitHub, clique no link "uploading an existing file"
2. Arraste e solte os arquivos do projeto que você baixou deste sandbox
3. Clique em "Commit changes"

### Opção 2: Usando Git na linha de comando (para usuários avançados)

```bash
git clone https://github.com/SEU-USUARIO/gestao-antecipacao.git
cd gestao-antecipacao
# Copie todos os arquivos do projeto para esta pasta
git add .
git commit -m "Versão inicial"
git push origin main
```

## Etapa 4: Conectar a Vercel ao GitHub

1. Acesse [Vercel.com](https://vercel.com) e faça login com sua conta
2. Na dashboard, clique no botão "Add New..." e selecione "Project"
3. Na seção "Import Git Repository", você deverá ver seus repositórios GitHub
   - Se não aparecer, clique em "Import Third-Party Git Repository" e siga as instruções para conectar sua conta GitHub
4. Encontre e selecione o repositório "gestao-antecipacao"

## Etapa 5: Configurar o projeto na Vercel

1. Na página de configuração do projeto, mantenha as configurações padrão:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` ou `next build`
   - Output Directory: .next
   - Install Command: `npm install` ou `pnpm install`

2. Expanda a seção "Environment Variables" e adicione as seguintes variáveis:
   - `NODE_ENV`: `production`

3. Clique em "Deploy"

## Etapa 6: Aguardar a implantação

A Vercel começará a construir e implantar seu aplicativo. Este processo pode levar alguns minutos. Você verá uma barra de progresso e logs de construção.

## Etapa 7: Acessar o aplicativo implantado

1. Quando a implantação for concluída, você verá uma mensagem de sucesso
2. Clique no link "Visit" para acessar seu aplicativo
3. O URL do seu aplicativo será algo como: `https://gestao-antecipacao.vercel.app`

## Importante: Limitações e Próximos Passos

### Banco de Dados

O aplicativo atual usa SQLite, que não é compatível com a Vercel para armazenamento persistente. Para uma solução completa, você precisará migrar para:

1. **Vercel KV** ou **Vercel Postgres** (soluções de banco de dados da Vercel)
2. **Supabase** ou **PlanetScale** (alternativas externas)

### Autenticação

A autenticação funcionará para testes, mas para um ambiente de produção, considere:

1. **NextAuth.js** para autenticação mais robusta
2. **Clerk** ou **Auth0** para soluções completas de identidade

## Suporte e Ajuda

Se você encontrar problemas durante a implantação, você pode:

1. Verificar os logs de construção na Vercel para identificar erros
2. Consultar a [documentação da Vercel](https://vercel.com/docs)
3. Entrar em contato com o suporte da Vercel

## Conclusão

Parabéns! Seu aplicativo de Gestão de Antecipação de Recebíveis agora está implantado na Vercel e acessível publicamente através da internet. Você pode compartilhar o URL com seus usuários para que eles possam acessar o aplicativo de qualquer lugar.
