const global = require("basescript");

global.initApp("goloswatchdog");
const log = global.getLogger("index");
const CONFIG = global.CONFIG;
const methods = require("../methods");
const telegram = require("./telegram");
const memory = require(process.cwd() + "/databases/watchdogdb");
const m = require("./messages");
const check = require("./check");

async function processMessage(chat, msg) {
    if(!msg || !msg.match("^[a-z0-9.-]+$")) {
        await telegram.send(chat.chat_id, "Введенное не является именем делегата");
        return;
    }
    const witness = await methods.getWitnessByAccount(msg);
    if(!witness || !witness.owner || witness.owner != msg) {
        await telegram.send(chat.chat_id, "Такой делегат не найден");
        return;
    }
    chat.witness = msg;
    await telegram.send(chat.chat_id, "Добро пожаловать делегат @" + msg + "!");
}

async function switchWatchAll(chat) {
    chat.watchall = !chat.watchall;
    await telegram.send(chat.chat_id, m.watchall_switch(chat));
}

async function onMsg(msg) {
    msg = msg.update.message;
    log.trace("onMsg", msg);
    const chat_id = msg.from.id; 
    const username = msg.from.username;
    try {

        const chat = await memory.getChat(chat_id);
        chat.username = username; //update always, can change
    
        switch(msg.text) {
            case "/start": {
                chat.username = username;
                await telegram.send(chat_id, "Привет, я бот, который наблюдает за делегатами. Введи имя делегата, если хочешь получать персонализированные уведомления. /help - список команд.")
            }; break;
            case "/help": {
                await telegram.send(chat_id, m.help())
            }; break;
            case "/watchall": {
                await switchWatchAll(chat);
            }; break;
            default:
                await processMessage(chat, msg.text);
        }
        await memory.saveChat(chat);
    } catch(e) {
        log.error("Error in onMsg", e)
    }
}

async function getWitnessesByBlock() {
try {
            const witnesses = await methods.getWitnessesByVote("",100);
            for(let w of witnesses) {

                let saved = await memory.loadWitness(w.owner);

                log.debug("witness", w.owner, "missed", w.total_missed)

                if(saved) {

                    await check(w, saved);
                } 

                await memory.saveWitness(w);
            }
} catch(error) {
// Error.
}
}

async function runBot() {
    await telegram.init(onMsg);
}

module.exports.getWitnessesByBlock = getWitnessesByBlock;
module.exports.runBot = runBot;