const puppeteer = require('puppeteer');

const URLS = {
  invoice: 'https://servicos.ceee.com.br/AgenciaWeb/consultarHistoricoPagto/consultarHistoricoPagto.do',
  login: 'https://servicos.ceee.com.br/AgenciaWeb/autenticar/loginCliente.do',
}

const log = message => {
  if(!process.env.DEBUG) return;
  return console.log('CEEE: ', message)
}

const verifyParams = ({ PASSWORD, CPF }) => (PASSWORD && CPF)

const login = async (page, { cpf, password }) => {
  log('Logging into CEEE - Agência Virtual')
  await page.goto(URLS.login);
  await page.waitFor('#CD_CPF');

  // fill CPF
  await page.evaluate(cpf => {
    document.querySelector('#CD_CPF').value = cpf;
    document.querySelector('.botao[type=submit]').click();
  }, cpf);
  await page.waitForNavigation();

  // fill Password
  await page.evaluate(password => {
    document.querySelector('[name=senha]').value = password;
    document.querySelector('.botao[type=submit]').click();
  }, password);
  await page.waitForNavigation();
}

const downloadInvoices = async page => {
  log('Downloading invoices')
  await page.goto(URLS.invoice);
  await page.waitFor('#histFat');

  const table = await page.$('#histFat');
  await table.screenshot({ path: 'invoice.png' });

}

const run = async () => {
  const { PASSWORD, CPF } = process.env;
  const credentials = {
    cpf: CPF,
    password: PASSWORD
  }

  if (!verifyParams(process.env)) {
    console.log(`Missing PASSWORD or CPF\nusage: PASSWORD=x CPF=y node index.js`)
    process.exit(1)
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await login(page, credentials)
  await downloadInvoices(page);

  await browser.close();
}

run()