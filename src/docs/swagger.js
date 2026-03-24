const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EcoHub API',
    version: '1.0.0',
    description: 'Documentação completa da API do EcoHub',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local'
    },
  ],
  paths: {
    // ==========================================
    // ROTAS DE USUÁRIOS (USERS)
    // ==========================================
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Lista todos os usuários',
        responses: { '200': { description: 'Sucesso' } }
      }
    },
    '/api/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Criar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Gustavo' },
                  email: { type: 'string', example: 'gustavo@email.com' },
                  senha: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Usuário criado com sucesso' },
          '500': { description: 'Erro no servidor' }
        }
      }
    },
    '/api/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Login do usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'gustavo@email.com' },
                  senha: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Login realizado com sucesso' },
          '401': { description: 'Credenciais inválidas' }
        }
      }
    },

    // ==========================================
    // ROTAS DE PROJETOS (PROJECTS)
    // ==========================================
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Lista todos os projetos',
        responses: { '200': { description: 'Sucesso' } }
      },
      post: {
        tags: ['Projects'],
        summary: 'Criar um novo projeto',
        responses: { '201': { description: 'Projeto criado' } }
      }
    },

    // ==========================================
    // ROTAS DE EVENTOS (EVENTS)
    // ==========================================
    '/api/events': {
      get: {
        tags: ['Events'],
        summary: 'Lista todos os eventos',
        responses: { '200': { description: 'Sucesso' } }
      }
    },

    // ==========================================
    // ROTAS DE NOTÍCIAS (NEWS)
    // ==========================================
    '/api/news': {
      get: {
        tags: ['News'],
        summary: 'Lista todas as notícias',
        responses: { '200': { description: 'Sucesso' } }
      }
    },

    // ==========================================
    // ROTAS DE POSTS (POSTS)
    // ==========================================
    '/api/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Lista todos os posts',
        responses: { '200': { description: 'Sucesso' } }
      }
    }
  }
};

module.exports = swaggerDocument;