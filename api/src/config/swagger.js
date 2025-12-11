const swaggerJsdoc = require('swagger-jsdoc');

const getServers = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return [
      {
        url: process.env.BASE_URL || 'https://smartadega.onrender.com',
        description: 'Producao'
      }
    ];
  }

  return [
    {
      url: process.env.BASE_URL || 'http://localhost:3000',
      description: 'Local'
    },
    {
      url: 'https://smartadega.onrender.com',
      description: 'Producao'
    }
  ];
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartAdega API',
      version: '1.0.0',
      description: 'API REST para gestao de vinhos na adega pessoal',
      contact: {
        name: 'SmartAdega',
        email: 'contato@smartadega.com'
      }
    },
    tags: [
      {
        name: 'System',
        description: 'Rotas de sistema e monitoramento'
      },
      {
        name: 'Wines',
        description: 'Gestao de vinhos'
      },
      {
        name: 'Recognition',
        description: 'Reconhecimento de vinhos por imagem'
      }
    ],
    servers: getServers(),
    components: {
      securitySchemes: {
        UserIdHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'ID do usuario autenticado'
        }
      },
      schemas: {
        Wine: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unico do vinho'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuario proprietario'
            },
            name: {
              type: 'string',
              description: 'Nome do vinho',
              example: 'Chateau Margaux'
            },
            grape: {
              type: 'string',
              description: 'Tipo de uva',
              example: 'Cabernet Sauvignon'
            },
            region: {
              type: 'string',
              description: 'Regiao de origem',
              example: 'Bordeaux, Franca'
            },
            year: {
              type: 'integer',
              description: 'Ano de producao',
              example: 2015
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Preco do vinho',
              example: 250.50
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Avaliacao de 0 a 5 (aceita valores decimais)',
              example: 4.5
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque',
              example: 3
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criacao'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da ultima atualizacao'
            }
          }
        },
        WineInput: {
          type: 'object',
          required: ['name', 'grape', 'region', 'year', 'price', 'rating', 'quantity'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome do vinho',
              example: 'Chateau Margaux'
            },
            grape: {
              type: 'string',
              description: 'Tipo de uva',
              example: 'Cabernet Sauvignon'
            },
            region: {
              type: 'string',
              description: 'Regiao de origem',
              example: 'Bordeaux, Franca'
            },
            year: {
              type: 'integer',
              description: 'Ano de producao',
              example: 2015,
              minimum: 1900
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Preco do vinho',
              example: 250.50,
              minimum: 0.01
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Avaliacao de 0 a 5 (aceita valores decimais)',
              example: 4.5
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque',
              example: 3
            }
          }
        },
        WineUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do vinho',
              example: 'Chateau Margaux'
            },
            grape: {
              type: 'string',
              description: 'Tipo de uva',
              example: 'Cabernet Sauvignon'
            },
            region: {
              type: 'string',
              description: 'Regiao de origem',
              example: 'Bordeaux, Franca'
            },
            year: {
              type: 'integer',
              description: 'Ano de producao',
              example: 2015
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Preco do vinho',
              example: 250.50
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Avaliacao de 0 a 5 (aceita valores decimais)',
              example: 4.5
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque',
              example: 3
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Vinho nao encontrado'
            }
          }
        }
      }
    },
    security: [
      {
        UserIdHeader: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
