const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_KEY, TELEGRAM_USER } = require('../constants');

class Bot {
    constructor() {
        if(!this.bot) {
            this.bot = new TelegramBot(TELEGRAM_KEY, { polling: false });
        }
    }

    sendMessage(message) {
        this.bot.sendMessage(TELEGRAM_USER, message);
    }
}

module.exports = new Bot();