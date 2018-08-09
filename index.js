const puppeteer = require('puppeteer');
require('dotenv').load();

const log = require('./lib/log');
const { URLS } = require('./lib/constants');
const {
    saveInvoice,
    getLastInvoice,
    printInvoices,
    getSavedInvoice,
} = require('./lib/invoice');
const Bot = require('./lib/telegram');

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

const run = async () => {
    const { PASSWORD, CPF } = process.env;
    let lastInvoiceSaved;
    const credentials = {
        cpf: CPF,
        password: PASSWORD
    }

    if (!verifyParams(process.env)) {
        console.log(`Missing PASSWORD or CPF\nusage: PASSWORD=x CPF=y node index.js`)
        process.exit(1)
    }

    try {
        lastInvoiceSaved = await getSavedInvoice();
    } catch (error) {
        log('None invoice found')
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await login(page, credentials);

    await page.goto(URLS.invoice);
    const invoice = await getLastInvoice(page);

    if (!lastInvoiceSaved) {
        const msg = `Sua última fatura disponível é: ${invoice.value}`;
        Bot.sendMessage(msg);
    }

    await saveInvoice(invoice);

    log(invoice);

    await browser.close();
}

run()