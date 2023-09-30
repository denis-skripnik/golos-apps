const global = require("basescript");

global.initApp("goloswatchdog");
const log = global.getLogger("index");
const CONFIG = global.CONFIG;
const methods = require("../methods");
const telegram = require("./telegram");
const memory = require(process.cwd() + "/databases/watchdogdb");
const m = require("./messages");
const check = require("./check");

async function witnessesList(chat) {
    let text = `Список добавленных делегатов. Введите логин с минусом (-login), чтобы удалить:
${chat.witnesses.join(', ')}`;
    await telegram.send(chat.chat_id, text);
}

async function processMessage(chat, msg) {
    let action = msg.charAt(0);
let account = msg.slice(1);
    if(!account || !account.match("^[a-z0-9.-]+$")) {
        await telegram.send(chat.chat_id, "Введенное не является делегатом.");
        return;
    }
    if (action === '-') {
        let index = chat.witnesses.indexOf(account);
if (index !== -1) {
  chat.witnesses.splice(index, 1); // Удаляем 1 элемент с найденного индекса
  await telegram.send(chat.chat_id, "Делегат удалён из списка.");
} else {
    await telegram.send(chat.chat_id, "Такого делегата нет в списке.");
} // end if index.
    } else if (action === '+') {
        const witness = await methods.getWitnessByAccount(account);
        if(!witness || !witness.owner || witness.owner != account) {
            await telegram.send(chat.chat_id, "Такой делегат не найден");
            return;
        }
        if(chat.witnesses.indexOf(account) > -1) {
            await telegram.send(chat.chat_id, "Делегат уже в списке.");
            return;
        }
        chat.witnesses.push(account);
        await telegram.send(chat.chat_id, "Делегат @" + account + " добавлен!");
    } // end if action +.
else {
    const witness = await methods.getWitnessByAccount(msg);
    if(!witness || !witness.owner || witness.owner != msg) {
        await telegram.send(chat.chat_id, "Такой делегат не найден");
        return;
    }
    if(chat.witnesses.indexOf(msg) > -1) {
        await telegram.send(chat.chat_id, "Делегат уже в списке.");
        return;
    }
    chat.witnesses.push(msg);
    await telegram.send(chat.chat_id, "Делегат @" + msg + " добавлен!");
}
} // end function

async function switchWatchAll(chat) {
    chat.watchall = !chat.watchall;
    await telegram.send(chat.chat_id, m.watchall_switch(chat));
}

async function onMsg(msg) {
    msg = msg.update.message;
    log.trace("onMsg", msg);
    let uid = msg.from.id;
    if (msg.is_bot == true) uid = msg.chat.id;
    const chat_id = uid; 
    const username = msg.from.username;
    try {

        const chat = await memory.getChat(chat_id);
        chat.username = username; //update always, can change
    
        switch(msg.text) {
            case "/start": {
                chat.username = username;
                await telegram.send(chat_id, "Привет, я бот, который наблюдает за делегатами. Введи +логин-делегата, если хочешь получать персонализированные уведомления. -логин-делегата - удалить из списка. /help - список команд.")
            }; break;
            case "/help": {
                await telegram.send(chat_id, m.help())
            }; break;
            case "/watchall": {
                await switchWatchAll(chat);
            }; break;
            case "/list": {
                await witnessesList(chat);
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
            const working_block = witnesses[0].last_confirmed_block_num - 2592000;
            for(let w of witnesses) {
if (w.last_confirmed_block_num <= working_block) continue;
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