const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Русский'] = require('./languages/ru.json');
lng['English'] = require('./languages/en.json');
const botjs = require("./bot");
const adb = require(process.cwd() + "/databases/golos_stakebot/accountsdb");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
var sjcl = require('sjcl');

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].add_account, lng[lang].accounts], [lng[lang].help, lng[lang].lang]];
    } else if (variant === 'to_vesting') {
        buttons = [[lng[lang].on, lng[lang].off, lng[lang].back, lng[lang].home]];
    } else if (variant.indexOf('change ') > -1) {
        let login = variant.split(' ')[1];
        buttons = [[lng[lang].change_posting + '@' + login, lng[lang].change_vesting_mode + '@' + login], [lng[lang].delete + '@' + login, lng[lang].back, lng[lang].home]];
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
        let id_hash = await helpers.stringToHash(id);
        if (message.indexOf('r') > -1) {
            let ref_id = parseInt(message.split(' r')[1]);
            let referer = await udb.getUserByRefererCode(ref_id);
        if (referer && ref_id !== user.referer_code) {
            console.log('Реферер найден.');
            let text = lng[referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${ref_id}`;
            let btns = await keybord(referer.lng, 'home');
            await botjs.sendMSG(referer.id, text, btns);
            let refs = [ref_id];
if (referer.referers.length > 0) {
    let referer2 = await udb.getUserByRefererCode(referer.referers[0]);
    if (referer2) {
        let text2 = lng[referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer.referers[0]}`;
        let btns2 = await keybord(referer2.lng, 'home');
    await botjs.sendMSG(referer2.id, text2, btns2);
    refs.push(referer.referers[0])
}
}
            await udb.addUser(id, refs, '', '', 'start', id_hash);
        } else {
            let extra_referer = await udb.getUser(ref_id);
            if (extra_referer) {
                let text = lng[extra_referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${extra_referer.referer_code}`;
                let btns = await keybord(extra_referer.lng, 'home');
                await botjs.sendMSG(extra_referer.id, text, btns);
                let refs = [extra_referer.referer_code];
    if (extra_referer.referers.length > 0) {
        let referer2 = await udb.getUserByRefererCode(extra_referer.referers[0]);
        if (referer2) {
            let text2 = lng[extra_referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer2.referer_code}`;
            let btns2 = await keybord(referer2.lng, 'home');
        await botjs.sendMSG(referer2.id, text2, btns2);
        refs.push(extra_referer.referers[0])
    }
    }
                await udb.addUser(id, refs, '', '', 'start', id_hash);
            } else {
                await udb.addUser(id, [524251903], '', '', 'start', id_hash);
            }
        }
        } else {
            await udb.addUser(id, [524251903], '', '', 'start', id_hash);
        }
    } else {
        if (lng[user.lng] && message !== lng[user.lng].back) {            
            if (message.indexOf('r') > -1) {
                let ref_id = parseInt(message.split(' r')[1]);
                let referer = await udb.getUserByRefererCode(ref_id);
                if (referer && ref_id !== user.referer_code) {
                    console.log('Реферер найден.');
                    let text = lng[referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${ref_id}`;
                    let btns = await keybord(referer.lng, 'home');
                    await botjs.sendMSG(referer.id, text, btns);
                    let refs = [ref_id];
        if (referer.referers.length > 0) {
            let referer2 = await udb.getUserByRefererCode(referer.referers[0]);
            if (referer2) {
                let text2 = lng[referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer.referers[0]}`;
                let btns2 = await keybord(referer2.lng, 'home');
            await botjs.sendMSG(referer2.id, text2, btns2);
            refs.push(referer.referers[0])
        }
        }
                await udb.updateUser(id, refs, user.lng, user.status, message, user.referer_code);
            } else {
                let extra_referer = await udb.getUser(ref_id);
                if (extra_referer) {
                    let text = lng[extra_referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${extra_referer.referer_code}`;
                    let btns = await keybord(extra_referer.lng, 'home');
                    await botjs.sendMSG(extra_referer.id, text, btns);
                    let refs = [extra_referer.referer_code];
        if (extra_referer.referers.length > 0) {
            let referer2 = await udb.getUserByRefererCode(extra_referer.referers[0]);
            if (referer2) {
                let text2 = lng[extra_referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer2.referer_code}`;
                let btns2 = await keybord(referer2.lng, 'home');
            await botjs.sendMSG(referer2.id, text2, btns2);
            refs.push(extra_referer.referers[0])
        }
        }
        await udb.updateUser(id, refs, user.lng, user.status, message, user.referer_code);
                } else {
                    await udb.updateUser(id, user.referers, user.lng, user.status, message, user.referer_code);
                }
            }
            } else {
                await udb.updateUser(id, user.referers, user.lng, user.status, message, user.referer_code);
            }
        } else {
            await udb.updateUser(id, user.referers, user.lng, user.prev_status, user.status, user.referer_code);
        }        
    }

    if (message.indexOf('start') > -1 || user && user.lng && message.indexOf(lng[user.lng].lang) > -1) {
let text = '';
let btns;
if (message.indexOf('start') > -1 && user && user.lng && user.lng !== '') {
    await main(id, my_name, lng[user.lng].auth, status);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns);
}
    } else if (user && user.lng && message.indexOf(lng[user.lng].auth) > -1) {
        let text = '';
        let btns;
        let my_accounts = await adb.getAccounts(id);
        if (my_accounts.length === 0) {
            text = lng[user.lng].enter_login;
            btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns);
        } else {
            await main(id, my_name, lng[user.lng].home, status);
        }
    } else if (user && user.lng && message.indexOf(lng[user.lng].add_account) > -1) {
            let text = lng[user.lng].enter_login;
            let btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns);
    } else if (user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
let referer;
if (user.referers.length > 0) {
        referer = user.referers[0];
} else {
    if (user.lng === 'Русский') {
        referer = 'Не найден';
            } else {
                referer = 'not found';
            }
}
        let text = lng[user.lng].home_message + referer + '. ' + lng[user.lng].referal_link + 'https://t.me/golos_stake_bot?start=r' + user.referer_code;
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].accounts) > -1) {
                                let text = lng[user.lng].accounts_list;
                                let accs = await adb.getAccounts(id);
                                if (accs && accs.length > 0) {
                                    for (let acc of accs) {
                                text += `
change ${acc.login}`;
                                    }
                                } else {
                                    text += lng[user.lng].account_list_is_empty;
                                }
                                                                let btns = await keybord(user.lng, 'back');
                                                                            await botjs.sendMSG(id, text, btns);    
                                                                        } else if (user && user.lng && message.indexOf(lng[user.lng].delete + '@') > -1) {
                                                                            let login = message.split('@')[1];
                                                                            if (message.split('@')[2]) {
                                                                                login += '@' + message.split('@')[2];
                                                                                    }
                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'delete_' + login, user.referer_code);
                                                                            let text = lng[user.lng].delete_conferm + login;
                                                    let btns = await keybord(user.lng, 'to_vesting');
                                                    await botjs.sendMSG(id, text, btns);
                                                                        } else if (message.indexOf('change ') > -1) {
                                                                            let text = lng[user.lng].change_account;
                                                                    let btns = await keybord(user.lng, message);
                                                                                        await botjs.sendMSG(id, text, btns);
                                                                                    } else if (user && user.lng && message.indexOf(lng[user.lng].change_posting + '@') > -1) {
                                                                                        let login = message.split('@')[1];
                                                                                        let my_acc = await adb.getAccount(login);
                                                                                        let text = '';
                                                                                        let btns;
                                                                                        if (my_acc && my_acc.id === id) {
                                                                                        let get_account = await methods.getAccount(login);
                                                                                        let acc = get_account[0]
                                                                                        if (get_account && get_account.length > 0) {
                                                                                            let posting_public_keys = [];
                                                                                        for (key of acc.posting.key_auths) {
                                                                                        posting_public_keys.push(key[0]);
                                                                                        }
                                                                                            text = lng[user.lng].type_posting;
                                                                                            btns = await keybord(user.lng, 'cancel');
                                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'changed_posting_' + message + '_' + JSON.stringify(posting_public_keys), user.referer_code);
                                                                                        } else {
                                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'change_account', user.referer_code);
                                                                                            text = lng[user.lng].not_account;
                                                                                            btns = await keybord(user.lng, 'home');
                                                                                        }
                                                                                    } else {
                                                                                        text = lng[user.lng].account_not_add;
                                                                                        btns = await keybord(user.lng, 'home');
                                                                                    }
                                                                                        await botjs.sendMSG(id, text, btns);
                                                                                    } else if (user && user.lng && message.indexOf(lng[user.lng].change_vesting_mode + '@') > -1) {
                                                                                        let login = message.split('@')[1];
                                                                                        await udb.updateUser(id, user.referers, user.lng, user.status, 'posting_' + login, user.referer_code);
                                                                                        let text = lng[user.lng].to_vesting;
                                                                let btns = await keybord(user.lng, 'to_vesting');
                                                                await botjs.sendMSG(id, text, btns);
                                                            } else if (user && user.lng && message.indexOf('голосяне') > -1) {
                                                                if (status === 2) {
let golos_accs = await adb.findAllAccounts();
let text = '';
let counter = 0;
for (let golos_acc of golos_accs) {
    counter++;
text += `${counter}. <a href="https://golos.in/@${golos_acc.login}">${golos_acc.login}</a>
`;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(364096327, text, btns);                                                                
}
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].news) > -1) {
                                                                if (status === 2) {
                                                                let text = message.split('Новости:')[1];
                                                                let btns = await keybord(user.lng, 'home');
let all_users = await udb.findAllUsers();
for (let one_user of all_users) {
    try {
    await botjs.sendMSG(one_user.id, text, btns);
    } catch(e) {
        continue;
    }
    await helpers.sleep(1000);
}
                                                                }                                                            
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].help) > -1) {
                                                                let text = lng[user.lng].help_text;
                                                                let btns = await keybord(user.lng, 'home');
                                                                            await botjs.sendMSG(id, text, btns);
                                                            } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
                    await udb.updateUser(id, user.referers, message, user.status, message, user.referer_code);
                    await botjs.sendMSG(id, text, btns);
                    await helpers.sleep(3000);
                    await main(id, my_name, lng[message].auth, status);
                } else if (user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) {
                    await main(id, my_name, user.prev_status, status);
                } else {
                    if (user.lng && lng[user.lng] && user.status === lng[user.lng].auth || lng[user.lng] && user.status === lng[user.lng].add_account) {
let get_account = await methods.getAccount(message);
let text = '';
let btns;
if (get_account && get_account.length > 0) {
    let acc = get_account[0]
    let posting_public_keys = [];
for (key of acc.posting.key_auths) {
posting_public_keys.push(key[0]);
}
    text = lng[user.lng].type_posting;
    btns = await keybord(user.lng, 'cancel');
    await udb.updateUser(id, user.referers, user.lng, user.status, 'login_' + message + '_' + JSON.stringify(posting_public_keys), user.referer_code);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, 'add_account', user.referer_code);
    text = lng[user.lng].not_account;
    btns = await keybord(user.lng, 'home');
}
await botjs.sendMSG(id, text, btns);
                    } else if (user.lng && lng[user.lng] && user.status.indexOf('login_') > -1) {
let login = user.status.split('_')[1];
let posting_public_keys = user.status.split('_')[2];
let text = '';
let btns;
try {
const public_wif = await methods.wifToPublic(message);
console.log(JSON.stringify(posting_public_keys), public_wif);
if (posting_public_keys.indexOf(public_wif) > -1) {
await adb.updateAccount(id, user.referer_code, login, sjcl.encrypt(login + '_postingKey_stakebot', message), false);
await udb.updateUser(id, user.referers, user.lng, user.status, 'posting_' + login, user.referer_code);
                        text = lng[user.lng].to_vesting;
btns = await keybord(user.lng, 'to_vesting');
await botjs.sendMSG(id, text, btns);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
} catch(e) {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_valid;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}    
} else if (user.lng && lng[user.lng] && user.status.indexOf('changed_posting_') > -1) {
    let arr = user.status.split('@')[1];
    let login = arr.split('_')[0];
    let text = '';
let btns;
try {
    const public_wif = await methods.wifToPublic(message);
    let posting_public_keys = user.status.split('_')[3];
    console.log(JSON.stringify(posting_public_keys), public_wif);
    if (posting_public_keys.indexOf(public_wif) > -1) {
    await adb.updateAccount(id, user.referer_code, login, sjcl.encrypt(login + '_postingKey_stakebot', message), false);
                            await udb.updateUser(id, user.referers, user.lng, user.status, 'added_posting_key', user.referer_code);
                            text = lng[user.lng].saved_posting_key + login;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
    } catch(e) {
        await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
        console.log(JSON.stringify(e));
        text = lng[user.lng].posting_not_valid;
        btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns);
    }    
} else if (user.lng && lng[user.lng] && user.status.indexOf('posting_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
        text = lng[user.lng].saved_false;
        let action = false;
        if (message === lng[user.lng].on) {
        action = true;
    text = lng[user.lng].saved_true;
    }
        await adb.updateAccount(id, user.referer_code, login, acc.posting_key, action);
    }                         else {
        text = lng[user.lng].not_saved;
    }
    await udb.updateUser(id, user.referers, user.lng, user.status, 'saved_data', user.referer_code);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
await helpers.sleep(3000);
await main(id, my_name, lng[user.lng].home, status);
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
    await udb.updateUser(id, user.referers, user.lng, user.status, 'delet_account', user.referer_code);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(3000);
    await main(id, my_name, lng[user.lng].home, status);
}
                    }
}

async function sendClaimNotify(members, referals) {
var sended_referals = [];
    for (let id in members) {
        try {
        let user = await udb.getUser(parseInt(id));
if (user) {
    let text = lng[user.lng].send_claim + `
`;
    text += members[id];
    if (referals[id]) {
        sended_referals.push(id);
        text += lng[user.lng].from_referals + `
`;
text += referals[id];
}    
let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(parseInt(id), text, btns);
await helpers.sleep(500);
}
} catch(e) {
    console.log(JSON.stringify(e));
    continue;
}
}

for (let id in referals) {
if (sended_referals.indexOf(id) === -1) {
    try {
                            let user = await udb.getUser(parseInt(id));
    if (user) {
        let text = lng[user.lng].from_referals + `
    `;
    text += referals[id];
    let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(parseInt(id), text, btns);
    await helpers.sleep(500);
    }
    } catch(e) {
        console.log(JSON.stringify(e));
        continue;
    }
}    
}       
}

        module.exports.main = main;
        module.exports.sendClaimNotify = sendClaimNotify;