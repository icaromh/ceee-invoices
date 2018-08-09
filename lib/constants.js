module.exports = {
  URLS: {
    invoice: 'https://servicos.ceee.com.br/AgenciaWeb/consultarHistoricoPagto/consultarHistoricoPagto.do',
    login: 'https://servicos.ceee.com.br/AgenciaWeb/autenticar/loginCliente.do',
  },
  DATA_PATH: 'data',
  TELEGRAM_KEY: process.env.TELEGRAM_KEY || false,
  TELEGRAM_USER: process.env.TELEGRAM_USER || false,
};