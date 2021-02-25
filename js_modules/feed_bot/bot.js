const conf = require(process.cwd() + '/config.json');
const TeleBot = require('telebot');
const bot = new TeleBot(conf.feed_bot.bot_api_key);
bot.start();
const i = require("./interface");

async function ids(uid) {
    if (conf.feed_bot.admins.indexOf(uid) > -1) {
        return {status: 2, id: uid};
    } else {
        return {status: 1, id: uid};
    }
}

async function keybord(btn_list, inline) {
    let replyMarkup;
    if (inline == true) {
        let btns = [];
        for (let row in btn_list) {
    if (typeof btn_list[row] == 'function') {
        continue;
    }
            btns[row] = [];
            for (let btn of btn_list[row]) {
    btns[row].push(bot.inlineButton(btn, {callback: btn}));
    }
        }
        
        replyMarkup = bot.inlineKeyboard(btns);
    } else {
        replyMarkup = bot.keyboard(btn_list, {resize: true});
    }
    var buttons = {
        parseMode: 'HTML',
        webPreview: false,
        replyMarkup};
        return buttons;
    }

    async function sendMSG(userId, text, buttons, inline) {
        await new Promise(r => setTimeout(r, 50));
        try {
        let options = await keybord(buttons, inline);
            await bot.sendMessage(userId, text, options);
        } catch(error) {
            console.log('Ошибка с отправкой сообщения: ' + JSON.stringify(error));
            if (error.error_code !== 403) {
            process.exit(1);
            }
        }
        }
    
        async function allCommands() {
            try {
            bot.on('text', async (msg) => {
                var uid = await ids(msg.from.id);
                var my_name = msg.from.first_name + ' ' + msg.from.last_name;
                    await i.main(uid.id, my_name, msg.text, uid.status);
            });
        
            bot.on('callbackQuery', async (msg) => {
                var uid = await ids(msg.from.id);
                var my_name = msg.from.first_name + ' ' + msg.from.last_name;
                    return await i.main(uid.id, my_name, msg.data, uid.status);
            });
        } catch(err) {
            console.log('Ошибка с получением сообщения: ' + JSON.stringify(err));
            process.exit(1);
        }
        }
        
module.exports.sendMSG = sendMSG;
module.exports.allCommands = allCommands;
module.exports.notify = i.notify;
module.exports.commentOperation = i.commentOperation;