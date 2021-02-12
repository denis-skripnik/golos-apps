let lng = {};
lng['Русский'] = require('./languages/ru.json');
lng['English'] = require('./languages/en.json');
const botjs = require("./bot");
const udb = require(process.cwd() + "/databases/feed_bot/usersdb");
const adb = require(process.cwd() + "/databases/feed_bot/accountsdb");
const methods = require("../methods");
const helpers = require("../helpers");

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].add_account, lng[lang].accounts], [lng[lang].help, lng[lang].lang]];
    } else if (variant === 'conferm') {
        buttons = [[lng[lang].on, lng[lang].off, lng[lang].back, lng[lang].home]];
    } else if (variant.indexOf('@') > -1 && variant.indexOf('accounts_buttons') === -1) {
        let login = variant.split('@')[1];
        buttons = [[lng[lang].delete, lng[lang].back, lng[lang].home]];
    } else if (variant.indexOf('accounts_buttons') > -1) {
        buttons = JSON.parse(variant.split('accounts_buttons')[1]);
    }     else if (variant === 'back') {
    buttons = [[lng[lang].back, lng[lang].home]];
}     else if (variant === 'cancel') {
        buttons = [[lng[lang].cancel]];
    }
    return buttons;
}

// Команды
async function main(id, my_name, message, status) {
    let user = await udb.getUser(id);
    if (!user) {
            await udb.addUser(id, '', '', 'start');
        } else {
                await udb.updateUser(id, user.lng, user.status, message);
    }
    
    if (message.indexOf('start') > -1 || user && user.lng && message.indexOf(lng[user.lng].lang) > -1) {
let text = '';
let btns;
if (message.indexOf('start') > -1 && user && user.lng && user.lng !== '') {
    await main(id, my_name, lng[user.lng].home, status);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns, false);
}
    } else if (user && user.lng && message.indexOf(lng[user.lng].add_account) > -1) {
            let text = lng[user.lng].enter_login;
            let btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns, false);
    } else if (user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
        let text = lng[user.lng].home_message;
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns, false);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].accounts) > -1) {
                                let text = lng[user.lng].accounts_list;
                                let accs = await adb.getAccounts(id);
                                if (accs && accs.length > 0) {
                                    let btns;
                                    if (accs.length > 12) {
                                        for (let acc of accs) {
                                            text += `
            @${acc.login}`;
                                                }
                                                                            btns = await keybord(user.lng, 'accounts');
                                                } else {
                                                    let n = 1;
let key = 0;
let buttons = [];
for (let acc of accs) {
if (!buttons[key]) {
buttons[key] = [];
}
buttons[key].push(`@${acc.login}`);
if (n % 2 == 0) {
key++;
}
n++;
}
text = lng[user.lng].select_account;
btns = await keybord(user.lng, 'accounts_buttons' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true);
}
                                                        } else {
                                                            text += lng[user.lng].account_list_is_empty;
                                                            btns = await keybord(user.lng, 'accounts');
                                                            await botjs.sendMSG(id, text, btns, false);
                                                        }
                                                                        } else if (user && user.lng && message === lng[user.lng].delete && user.status.indexOf('@') > -1) {
                                                                            let login = user.status.split('@')[1];
                                                                            if (message.split('@')[2]) {
                                                                                login += '@' + message.split('@')[2];
                                                                                    }
                                                                            await udb.updateUser(id, user.lng, user.status, 'delete_' + login);
                                                                            let text = lng[user.lng].delete_conferm + login;
                                                    let btns = await keybord(user.lng, 'conferm');
                                                    await botjs.sendMSG(id, text, btns, false);
                                                                        } else if (message.indexOf('@') > -1 && user.status.indexOf(lng[user.lng].news) === -1) {
                                                                            let acc = await adb.getAccount(message.split('@')[1]);
                                                                            if (acc && acc.id === id) {
                                                                                let text = lng[user.lng].change_account + message;
                                                                                let btns = await keybord(user.lng, message);
                                                                                                    await botjs.sendMSG(id, text, btns, false);
                                                                            }
                                                                        } else if (user && user.lng && message.indexOf(lng[user.lng].news) > -1) {
                                                                            if (status === 2) {
                                                                                let text = lng[user.lng].type_news;
                                                                                let btns = await keybord(user.lng, 'cancel');
                                                                                            await botjs.sendMSG(id, text, btns, false);
                                                                            }                                                            
                                                                        } else if (user && user.lng && message.indexOf(lng[user.lng].help) > -1) {
                                                                let text = lng[user.lng].help_text;
                                                                let btns = await keybord(user.lng, 'home');
                                                                            await botjs.sendMSG(id, text, btns, false);
                                                            } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
                    await udb.updateUser(id, message, user.status, message);
                    await botjs.sendMSG(id, text, btns, false);
                    await helpers.sleep(3000);
                    await main(id, my_name, lng[message].add_account, status);
                } else if (user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) {
                    await main(id, my_name, user.prev_status, status);
                } else {
                    if (user.lng && lng[user.lng] && user.status === lng[user.lng].add_account) {
let get_account = await methods.getAccount(message);
let text = '';
let btns;
if (get_account && get_account.length > 0) {
    text = lng[user.lng].saved_true;
    await adb.updateAccount(id, message, user.lng, -1);
    btns = await keybord(user.lng, 'home');
    await udb.updateUser(id, user.lng, user.status, 'login_' + message);
} else {
    await udb.updateUser(id, user.lng, user.status, 'add_account');
    text = lng[user.lng].not_account;
    btns = await keybord(user.lng, 'home');
}
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('delete_') > -1) {
    let login = user.status.split('_')[1];
    if (user.status.split('_')[2]) {
login += ' @' + user.status.split('_')[2];
    }
    console.log('Логин: ' + login);
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc) {
        text = lng[user.lng].delete_false;
        if (message === lng[user.lng].on) {
    text = lng[user.lng].delete_true;
    let res = await adb.removeAccount(id, login);
console.log('Результат: ' + JSON.stringify(res));
}
    }                        
    await udb.updateUser(id, user.lng, user.status, 'delet_account');
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
    await helpers.sleep(3000);
    await main(id, my_name, lng[user.lng].home, status);
} else if (user.lng && lng[user.lng] && user.status.indexOf(lng[user.lng].news) > -1 && status === 2) {
    let btns = await keybord(user.lng, 'home');
let all_users = await udb.findAllUsers();
for (let one_user of all_users) {
try {
await botjs.sendMSG(one_user.id, message, btns, false);
} catch(e) {
continue;
}
await helpers.sleep(1000);
}
}
                    }
}

async function notify() {
    let accounts = await adb.findAllAccounts();
    if (accounts && accounts.length > 0) {
            for (let acc of accounts) {
            let posts = await methods.getFeed(acc.login, acc.last_post);
            let last_post = posts[0].comment.id;
        let feed = `${lng[acc.lng].feed_name} <a href="https://dpos.space/golos/profiles/${acc.login}">${acc.login}</a>`;
    let posts_counter = 0;
    for (let post of posts) {
    if (post.comment.id !== acc.last_post) {
        posts_counter++;
        let reblog_by = post.comment.reblog_by;
        let reblog_by_str = '';
        if (reblog_by.length > 0) reblog_by_str = ` ${lng[acc.lng].reblog_by} ${reblog_by.join(',')}`;
        feed += `
    ${posts_counter}. <a href="https://golos.id/${post.comment.parent_permlink}/@${post.comment.author}/${post.comment.permlink}">${post.comment.title}</a>${reblog_by_str}`;
    } // end if this last_post.
    } // end for
        if (posts_counter > 0) {
            let btns = await keybord(acc.lng, 'home');
            await botjs.sendMSG(id, feed, btns, false);            
        }
    }
    }
}

module.exports.main = main;
module.exports.notify = notify;