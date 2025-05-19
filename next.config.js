/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configuração para exportação estática
  images: {
    unoptimized: true,
  },
  // Desabilitar rotas dinâmicas que não são compatíveis com exportação estática
  trailingSlash: true,
};

module.exports = nextConfig;
