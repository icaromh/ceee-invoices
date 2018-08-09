const log = message => {
    if(!process.env.DEBUG) return;
    return console.log('CEEE: ', message)
}

module.exports = log