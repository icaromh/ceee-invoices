const fs = require('fs');
const path = require('path');

const log = require('./log');
const { DATA_PATH } = require('./constants');

const getLastInvoice = async page => {
    log('Getting last Invoice');
    await page.waitFor('#histFat');

    const invoice = await page.evaluate(() => {
        const $row = document.querySelector('#histFat tbody > tr');

        return {
            ref: $row.querySelector('td:nth-child(2)').innerText.trim(),
            status: $row.querySelector('td:nth-child(3)').innerText.trim(),
            dueDate: $row.querySelector('td:nth-child(4)').innerText.trim(),
            value: $row.querySelector('td:nth-child(6)').innerText.trim(),
        }
    })

    return invoice;
}

const printInvoices = async page => {
    log('Printing invoices')
    await page.waitFor('#histFat');

    const table = await page.$('#histFat');
    await table.screenshot({ path: path.join(DATA_PATH, 'invoice.png') });

    return true;
}


const getSavedInvoice = async () => {
    log('Retrieving the last invoice saved');
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(DATA_PATH, 'invoice.json'), (err, data) => {
            if (err) return reject(err)
            return resolve(JSON.parse(data))
        });
    })
}

const saveInvoice = async invoice => {
    log('Saving the last invoice found');
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(DATA_PATH, 'invoice.json'), JSON.stringify(invoice), err => {
            if (err) reject(err)
            resolve(true)
        });
    })
}


module.exports = {
    saveInvoice,
    getLastInvoice,
    printInvoices,
    getSavedInvoice,
}