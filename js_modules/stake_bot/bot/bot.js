const conf = require(process.cwd() + '/config.json');
const { Bot } = require("grammy");
const bot = new Bot(conf.stakebot.bot_api_key);
bot.start();
const i = require("./interface");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");

async function ids(uid) {
    if (conf.stakebot.admins.indexOf(uid) > -1) {
        return {status: 2, id: uid};
    } else {
        return {status: 1, id: uid};
    }
}

async function keybord(btn_list, inline) {
    let replyMarkup;
    if (inline == true) {
        let inline_keyboard = [];
        for (let row in btn_list) {
    if (typeof btn_list[row] == 'function') {
        continue;
    }
    inline_keyboard[row] = [];
            for (let btn of btn_list[row]) {
                let bytes = Buffer.from(btn[0]).length;
                if (btn[0].indexOf('web:') === -1 && bytes > 64) continue;
            if (btn[0].indexOf('web:') > -1) {
                inline_keyboard[row].push({text: btn[1], web_app: {url: btn[0].split('web:')[1]}});
            } else {
                inline_keyboard[row].push({text: btn[1], callback_data: btn[0]});
        }
    }
        }

        reply_markup = {inline_keyboard};
    } else {
        let keyboard = [];
        for (let n in btn_list) {
    let btn_row = btn_list[n];
    if (!keyboard[n]) keyboard[n] = [];
    for (let btn of btn_row) {
    keyboard[n].push({text: btn});
    }
            }
            reply_markup = {keyboard, resize_keyboard: true};
    }
    var buttons = {
        parse_mode: 'HTML',
        webPreview: false,
        reply_markup};
        return buttons;
    }

async function sendMSG(userId, text, buttons, inline) {
    await new Promise(r => setTimeout(r, 50));
    try {
    let options = await keybord(buttons, inline);
        await bot.api.sendMessage(userId, text, options);
    } catch(error) {
        console.log(text);
        console.log('Ошибка с отправкой сообщения: ' + error);
        if (error.error_code === 403 && error.description === "Forbidden: bot was blocked by the user" || error.error_code === 403 && error.description === "Forbidden: user is deactivated") {
        await udb.removeUser(userId);
        }
    }
    }

   
async function allCommands() {
    try {
    bot.on('message', async (msg) => {
        msg = msg.update.message;
        var uid = await ids(msg.from.id);
        var my_name = msg.from.first_name + ' ' + msg.from.last_name;
            await i.main(uid.id, my_name, msg.text, uid.status);
    });

    bot.on('callback_query', async (msg) => {
        msg = msg.update.callback_query;
        var uid = await ids(msg.from.id);
        var my_name = msg.from.first_name + ' ' + msg.from.last_name;
            return await i.main(uid.id, my_name, msg.data, uid.status);
    });
} catch(err) {
    console.log('Ошибка с получением сообщения: ' + err);
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