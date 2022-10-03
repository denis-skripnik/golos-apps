const global = require("basescript");
const conf = require(process.cwd() + '/config.json');
const log = global.getLogger("telegram");

const { Bot } = require("grammy");

let bot = null;

async function send(chat_id, msg, kbd) {
    try {
        let opts = { parse: "HTML" };
        log.debug("msg", msg);
        log.debug("kbd", kbd);
        if (kbd) {
            opts.markup = kbd;
        }
        await bot.api.sendMessage(chat_id, msg, opts)
    } catch(e) {
        log.error("unable to send message")
        log.error(e);
    }
}

async function init(onMsg) {
    bot = new Bot(conf.watchdog.token);
   
    bot.on('message', onMsg); 
    bot.start();
}

module.exports.init = init;
module.exports.send = send;