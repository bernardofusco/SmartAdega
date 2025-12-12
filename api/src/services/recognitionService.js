const FormData = require('form-data');
const axios = require('axios');

class RecognitionService {
  constructor() {
    this.apiUrl = 'https://api4ai.cloud/alco-rec/v1/results';
    this.apiKey = process.env.API4AI_KEY;
  }

  formatWineName(label) {
    if (!label) return '';

    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async analyzeWineImage(file) {
    try {
      // Mock para testes E2E (não consome quota da API4AI)
      if (process.env.API4AI_MOCK === 'true' || process.env.NODE_ENV === 'test') {
        console.log('🧪 Mock de reconhecimento ativado (API4AI_MOCK=true)');
        return this.getMockWineData();
      }

      if (!this.apiKey) {
        throw new Error('Chave da API nao configurada');
      }

      const formData = new FormData();
      formData.append('image', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'X-API-KEY': this.apiKey,
          ...formData.getHeaders()
        },
        timeout: 30000
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        return this.getEmptyWineData();
      }

      const entities = response.data.results[0].entities;

      if (!entities || entities.length === 0) {
        return this.getEmptyWineData();
      }

      const wineArray = entities[0].array;

      if (!wineArray || wineArray.length === 0) {
        return this.getEmptyWineData();
      }

      const wineData = wineArray[0];

      const wineName = wineData.name || wineData.winery || '';
      const grape = wineData.variety && wineData.variety !== 'N/A' ? wineData.variety : '';
      const region = wineData.region || '';
      const year = wineData.vintage || '';

      return {
        nome_do_vinho: wineName,
        uva: grape,
        regiao: region,
        ano: year,
        preco: '',
        quantidade: '',
        avaliacao: ''
      };
    } catch (error) {
      console.error('Erro no reconhecimento:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(`Erro na API externa: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        console.error('Request error:', error.code);
        throw new Error('Erro ao conectar com a API de reconhecimento');
      } else {
        console.error('Error details:', error);
        throw new Error(error.message || 'Erro ao processar reconhecimento');
      }
    }
  }

  getEmptyWineData() {
    return {
      nome_do_vinho: '',
      uva: '',
      regiao: '',
      ano: '',
      preco: '',
      quantidade: '',
      avaliacao: ''
    };
  }

  getMockWineData() {
    // Dados mockados para testes E2E
    return {
      nome_do_vinho: 'Château Test Playwright 2020',
      uva: 'Cabernet Sauvignon',
      regiao: 'Bordeaux',
      ano: '2020',
      preco: '',
      quantidade: '',
      avaliacao: ''
    };
  }
}

module.exports = new RecognitionService();
