const conf = require(process.cwd() + '/config.json');
const TeleBot = require('telebot');
const bot = new TeleBot(conf.stakebot.bot_api_key);
bot.start();
const i = require("./interface");

async function ids(uid) {
    if (conf.stakebot.admins.indexOf(uid) > -1) {
        return {status: 2, id: uid};
    } else {
        return {status: 1, id: uid};
    }
}

async function keybord(btn_list) {
    let replyMarkup = bot.keyboard(btn_list, {resize: true});
    var buttons = {
        parseMode: 'Html',
        replyMarkup};
        return buttons;
    }

async function sendMSG(userId, text, buttons) {
    try {
    let options = await keybord(buttons);
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
} catch(err) {
    console.log('Ошибка с получением сообщения: ' + JSON.stringify(err));
    process.exit(1);
}
}

async function sendChatsMSG(text) {
    try {
    let chats = [-1001498464851, '@kitmoongroup', -1001405155024];
for (let chat of chats) {
    await sendMSG(chat, text, '');
}
    } catch(e) {
        console.log(JSON.stringify(e));
    }
}

module.exports.sendMSG = sendMSG;
module.exports.allCommands = allCommands;
module.exports.sendChatsMSG = sendChatsMSG;