const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Русский'] = require('./languages/ru.json');
lng['English'] = require('./languages/en.json');
const botjs = require("./bot");
const adb = require(process.cwd() + "/databases/golos_stakebot/accountsdb");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");
const biddb = require(process.cwd() + "/databases/golos_stakebot/bidsdb");
const pdb = require(process.cwd() + "/databases/golos_stakebot/postsdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
var sjcl = require('sjcl');

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].add_account, lng[lang].accounts], [lng[lang].help, lng[lang].lang]];
    } else if (variant === 'on_off') {
        buttons = [[lng[lang].on, lng[lang].off, lng[lang].back, lng[lang].home]];
    } else if (variant.indexOf('@') > -1 && variant.indexOf('accounts_buttons') === -1 && variant.indexOf('unvote') === -1) {
        let login = variant.split('@')[1];
        buttons = [[lng[lang].change_posting, lng[lang].change_vesting_mode, lng[lang].auto_curator, lng[lang].rate_button], [lng[lang].delete, lng[lang].back, lng[lang].home]];
    } else if (variant === 'auto_curator') {
        buttons = [[lng[lang].min_energy, lng[lang].curators, lng[lang].favorits, lng[lang].curators_mode], [lng[lang].exclude_authors, lng[lang].favorits_percent, lng[lang].back, lng[lang].home]];
    } else if (variant.indexOf('unvote@') > -1) {
        let post = variant.split('@')[1];
        buttons = [[[lng[lang].unvote + post, lng[lang].unvote_button]]];
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
        let id_hash = await helpers.stringToHash(id);
        if (message.indexOf('r') > -1) {
            let ref_id = parseInt(message.split(' r')[1]);
            let referer = await udb.getUserByRefererCode(ref_id);
        if (referer) {
            console.log('Реферер найден.');
            let text = lng[referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${ref_id}`;
            let btns = await keybord(referer.lng, 'home');
            await botjs.sendMSG(referer.id, text, btns, false);
            let refs = [ref_id];
if (referer.referers.length > 0) {
    let referer2 = await udb.getUserByRefererCode(referer.referers[0]);
    if (referer2) {
        let text2 = lng[referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer.referers[0]}`;
        let btns2 = await keybord(referer2.lng, 'home');
    await botjs.sendMSG(referer2.id, text2, btns2, false);
    refs.push(referer.referers[0])
}
}
            await udb.addUser(id, refs, '', '', 'start', id_hash);
        } else {
            let extra_referer = await udb.getUser(ref_id);
            if (extra_referer) {
                let text = lng[extra_referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${extra_referer.referer_code}`;
                let btns = await keybord(extra_referer.lng, 'home');
                await botjs.sendMSG(extra_referer.id, text, btns, false);
                let refs = [extra_referer.referer_code];
    if (extra_referer.referers.length > 0) {
        let referer2 = await udb.getUserByRefererCode(extra_referer.referers[0]);
        if (referer2) {
            let text2 = lng[extra_referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer2.referer_code}`;
            let btns2 = await keybord(referer2.lng, 'home');
        await botjs.sendMSG(referer2.id, text2, btns2, false);
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
                    await botjs.sendMSG(referer.id, text, btns, false);
                    let refs = [ref_id];
        if (referer.referers.length > 0) {
            let referer2 = await udb.getUserByRefererCode(referer.referers[0]);
            if (referer2) {
                let text2 = lng[referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer.referers[0]}`;
                let btns2 = await keybord(referer2.lng, 'home');
            await botjs.sendMSG(referer2.id, text2, btns2, false);
            refs.push(referer.referers[0])
        }
        }
                await udb.updateUser(id, refs, user.lng, user.status, message, user.referer_code);
            } else {
                let extra_referer = await udb.getUser(ref_id);
                if (extra_referer) {
                    let text = lng[extra_referer.lng].new_referal1 + `https://t.me/golos_stake_bot?start=r${extra_referer.referer_code}`;
                    let btns = await keybord(extra_referer.lng, 'home');
                    await botjs.sendMSG(extra_referer.id, text, btns, false);
                    let refs = [extra_referer.referer_code];
        if (extra_referer.referers.length > 0) {
            let referer2 = await udb.getUserByRefererCode(extra_referer.referers[0]);
            if (referer2) {
                let text2 = lng[extra_referer.lng].new_referal2 + `https://t.me/golos_stake_bot?start=r${referer2.referer_code}`;
                let btns2 = await keybord(referer2.lng, 'home');
            await botjs.sendMSG(referer2.id, text2, btns2, false);
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
    await botjs.sendMSG(id, text, btns, false);
}
    } else if (user && user.lng && message.indexOf(lng[user.lng].auth) > -1) {
        let text = '';
        let btns;
        let my_accounts = await adb.getAccounts(id);
        if (my_accounts.length === 0) {
            text = lng[user.lng].enter_login;
            btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns, false);
        } else {
            await main(id, my_name, lng[user.lng].home, status);
        }
    } else if (user && user.lng && message.indexOf(lng[user.lng].add_account) > -1) {
            let text = lng[user.lng].enter_login;
            let btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns, false);
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
buttons[key].push([`@${acc.login}`, `@${acc.login}`]);
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
                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'delete_' + login, user.referer_code);
                                                                            let text = lng[user.lng].delete_conferm + login;
                                                    let btns = await keybord(user.lng, 'on_off');
                                                    await botjs.sendMSG(id, text, btns, false);
                                                                        } else if (message.indexOf('@') > -1 && user.status.indexOf(lng[user.lng].news) === -1 && user.status.indexOf('postUrl_') === -1) {
                                                                            let acc = await adb.getAccount(message.split('@')[1]);
                                                                            if (acc && acc.id === id) {
                                                                                let text = lng[user.lng].change_account + message;
                                                                                let btns = await keybord(user.lng, message);
                                                                                                    await botjs.sendMSG(id, text, btns, false);
                                                                            }
                                                                                    } else if (user && user.lng && message === lng[user.lng].change_posting && user.status.indexOf('@') > -1) {
                                                                                        let login = user.status.split('@')[1];
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
                                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'changed_posting_' + login + '_' + JSON.stringify(posting_public_keys), user.referer_code);
                                                                                        } else {
                                                                                            await udb.updateUser(id, user.referers, user.lng, user.status, 'change_account', user.referer_code);
                                                                                            text = lng[user.lng].not_account;
                                                                                            btns = await keybord(user.lng, 'home');
                                                                                        }
                                                                                    } else {
                                                                                        text = lng[user.lng].account_not_add;
                                                                                        btns = await keybord(user.lng, 'home');
                                                                                    }
                                                                                        await botjs.sendMSG(id, text, btns, false);
                                                                                    } else if (user && user.lng && message === lng[user.lng].change_vesting_mode && user.status.indexOf('@') > -1) {
                                                                                        let login = user.status.split('@')[1];
                                                                                        await udb.updateUser(id, user.referers, user.lng, user.status, 'posting_' + login, user.referer_code);
                                                                                        let text = lng[user.lng].to_vesting;
                                                                let btns = await keybord(user.lng, 'on_off');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                            } else if (user && user.lng && message === lng[user.lng].auto_curator && user.status.indexOf('@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                let acc = await adb.getAccount(login);
    if (acc && acc.id === id) {
        let text = `${lng[user.lng].auto_curator_text}:
${lng[user.lng].min_energy}: ${acc.min_energy},
${lng[user.lng].curators}:
<code>${acc.curators}</code>,
${lng[user.lng].exclude_authors}:
<code>${acc.exclude_authors}</code>,

${lng[user.lng].favorits}:
<code>${acc.favorits}</code>,

${lng[user.lng].curators_mode}: ${acc.curators_mode},
${lng[user.lng].favorits_percent}: ${acc.favorits_percent}.`;
                                                                    let btns = await keybord(user.lng, 'auto_curator');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'auto_curator@' + login, user.referer_code);
    }
                                                            } else if (user && user.lng && message === lng[user.lng].min_energy && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].enter_min_energy;
                                                                    let btns = await keybord(user.lng, 'cancel');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'minEnergy_' + login, user.referer_code);
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].unvote) > -1) {
                                                             let unvote_data = message.split(' ')[1];
                                                             let unvote_arr = unvote_data.split('_');
                                                             let login = unvote_arr[0];
                                                                    let post_id = parseInt(unvote_arr[1]);
                                                                                                                                 let text = lng[user.lng].unvote_failed;
                                                                    let acc = await adb.getAccount(login);
                                                                    if (acc && acc.id === id) {
                                                                        if (acc.posting_key !== '') {
                                                                            let posting = sjcl.decrypt(acc.login + '_postingKey_stakebot', acc.posting_key);
                                                                        try {
    let post = await pdb.getPost(post_id);
                                                                            var operations = [];
    operations.push(["vote",{"voter": login, "author": post.author, "permlink": post.permlink, "weight": 0}]);
    await methods.send(operations, posting);
    text = lng[user.lng].unvote_ok;
} catch(er) {
    console.error(er);
}
                                                                        }
}
                                                                    let btns = await keybord(user.lng, 'home');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                            } else if (user && user.lng && message === lng[user.lng].curators && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].curators_text;
                                                                    let btns = await keybord(user.lng, 'cancel');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'curators_' + login, user.referer_code);
                                                            } else if (user && user.lng && message === lng[user.lng].curators_mode && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].curators_mode_text;
                                                                    let btns = await keybord(user.lng, 'on_off');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'curatorsMode_' + login, user.referer_code);
                                                            } else if (user && user.lng && message === lng[user.lng].favorits && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].favorits_text;
                                                                    let btns = await keybord(user.lng, 'cancel');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'favorits_' + login, user.referer_code);
                                                            } else if (user && user.lng && message === lng[user.lng].favorits_percent && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].favorits_percent_text;
                                                                    let btns = await keybord(user.lng, 'cancel');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'favoritsPercent_' + login, user.referer_code);
                                                            } else if (user && user.lng && message === lng[user.lng].exclude_authors && user.status.indexOf('auto_curator@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                    let text = lng[user.lng].exclude_authors_text;
                                                                    let btns = await keybord(user.lng, 'cancel');
                                                                await botjs.sendMSG(id, text, btns, false);
                                                                await udb.updateUser(id, user.referers, user.lng, user.status, 'excludeAuthors_' + login, user.referer_code);
                                                            } else if (user && user.lng && message === lng[user.lng].rate_button && user.status.indexOf('@') > -1) {
                                                                let login = user.status.split('@')[1];
                                                                let my_acc = await adb.getAccount(login);
                                                                let text = '';
                                                                let btns;
                                                                if (my_acc && my_acc.id === id) {
                                                                let get_account = await methods.getAccount(login);
                                                                let acc = get_account[0]
                                                                if (get_account && get_account.length > 0) {
                                                                    text = lng[user.lng].type_rate + acc.tip_balance;
                                                                    btns = await keybord(user.lng, 'cancel');
                                                                    await udb.updateUser(id, user.referers, user.lng, user.status, 'typed_rate@' + login + ':' + parseFloat(acc.tip_balance), user.referer_code);
                                                                } else {
                                                                    await udb.updateUser(id, user.referers, user.lng, user.status, 'send_rate', user.referer_code);
                                                                    text = lng[user.lng].not_account;
                                                                    btns = await keybord(user.lng, 'home');
                                                                }
                                                            } else {
                                                                text = lng[user.lng].account_not_add;
                                                                btns = await keybord(user.lng, 'home');
                                                            }
                                                            await botjs.sendMSG(id, text, btns, false);
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
await botjs.sendMSG(364096327, text, btns, false);                                                                
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
                    await udb.updateUser(id, user.referers, message, user.status, message, user.referer_code);
                    await botjs.sendMSG(id, text, btns, false);
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
await botjs.sendMSG(id, text, btns, false);
                    } else if (user.lng && lng[user.lng] && user.status.indexOf('login_') > -1) {
let login = user.status.split('_')[1];
let posting_public_keys = user.status.split('_')[2];
let text = '';
let btns;
try {
const public_wif = await methods.wifToPublic(message);
if (posting_public_keys.indexOf(public_wif) > -1) {
await adb.updateAccount(id, user.referer_code, login, sjcl.encrypt(login + '_postingKey_stakebot', message), false, 100, '', '', 'replay', 0, '');
await udb.updateUser(id, user.referers, user.lng, user.status, 'posting_' + login, user.referer_code);
                        text = lng[user.lng].to_vesting;
btns = await keybord(user.lng, 'on_off');
await botjs.sendMSG(id, text, btns, false);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
} catch(e) {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_valid;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
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
    await adb.updateAccount(id, user.referer_code, login, sjcl.encrypt(login + '_postingKey_stakebot', message), false, 100, '', '', 'replay', 0, '');
                            await udb.updateUser(id, user.referers, user.lng, user.status, 'added_posting_key', user.referer_code);
                            text = lng[user.lng].saved_posting_key + login;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
    } catch(e) {
        await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
        console.log(JSON.stringify(e));
        text = lng[user.lng].posting_not_valid;
        btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns, false);
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
        await adb.updateAccount(id, user.referer_code, login, acc.posting_key, action, acc.min_energy, acc.curators, acc.favorits, acc.curators_mode, acc.favorits_percent, acc.exclude_authors);
    }                         else {
        text = lng[user.lng].not_saved;
    }
    await udb.updateUser(id, user.referers, user.lng, user.status, 'saved_data', user.referer_code);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
await helpers.sleep(3000);
await main(id, my_name, lng[user.lng].home, status);
} else if (user.lng && lng[user.lng] && user.status.indexOf('minEnergy_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
    let energy = parseFloat(message);
if (energy && energy > 0) {
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, energy, acc.curators, acc.favorits, acc.curators_mode, acc.favorits_percent, acc.exclude_authors);
    text = lng[user.lng].min_energy_saved;
} else {
    text = lng[user.lng].min_energy_not_valid;
}
} else {
    text = lng[user.lng].account_not_add;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('curators_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
let curators = message.split(',');
let accs = await methods.getAccounts(curators);
if (accs && accs.length === curators.length) {
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, acc.min_energy, message, acc.favorits, acc.curators_mode, acc.favorits_percent, acc.exclude_authors);
    text = lng[user.lng].curators_saved;
} else {
    text = lng[user.lng].curators_not_valid;
}
} else {
    text = lng[user.lng].account_not_add;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('curatorsMode_') > -1) {
    let login = user.status.split('_')[1];
    if (user.status.split('_')[2]) {
login += ' @' + user.status.split('_')[2];
    }
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
        let mode = 'no';
        text = lng[user.lng].curators_mode_off;
        if (message === lng[user.lng].on) {
    text = lng[user.lng].curators_mode_on;
    mode = 'replay';
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, acc.min_energy, acc.curators, acc.favorits, mode, acc.favorits_percent, acc.exclude_authors);
}
    }                        
    await udb.updateUser(id, user.referers, user.lng, user.status, 'auto_curator@' + login, user.referer_code);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('favorits_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
let favorits = message.split(',');
let accs = await methods.getAccounts(favorits);
if (accs && accs.length === favorits.length) {
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, acc.min_energy, acc.curators, message, acc.curators_mode, acc.favorits_percent, acc.exclude_authors);
    text = lng[user.lng].favorits_saved;
} else {
    text = lng[user.lng].favorits_not_valid;
}
} else {
    text = lng[user.lng].account_not_add;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('favoritsPercent_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
    let percent = parseFloat(message);
if (percent && percent > 0) {
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, acc.min_energy, acc.curators, acc.favorits, acc.curators_mode, percent, acc.exclude_authors);
    text = lng[user.lng].favorits_percent_saved;
} else {
    text = lng[user.lng].favorits_percent_not_valid;
}
} else {
    text = lng[user.lng].account_not_add;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('excludeAuthors_') > -1) {
    let login = user.status.split('_')[1];
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc && acc.id === id) {
let authors = message.split(',');
let accs = await methods.getAccounts(authors);
if (accs && accs.length === authors.length) {
    await adb.updateAccount(id, user.referer_code, login, acc.posting_key, acc.to_vesting_shares, acc.min_energy, acc.curators, acc.favorits, acc.curators_mode, acc.favorits_percent, message);
    text = lng[user.lng].exclude_authors_saved;
} else {
    text = lng[user.lng].exclude_authors_not_valid;
}
} else {
    text = lng[user.lng].account_not_add;
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
} else if (user.lng && lng[user.lng] && user.status.indexOf('typed_rate@') > -1) {
        let arr = user.status.split('@')[1];
        let login = arr.split(':')[0];
    let max = arr.split(':')[1];
    let amount = parseFloat(message);
        let text = '';
let btns;
if (amount <= max && amount >= 0.1) {
    await udb.updateUser(id, user.referers, user.lng, user.status, 'rate_' + login + ':' + amount, user.referer_code);
    text = lng[user.lng].rate_conferm + amount + ' GOLOS';
    btns = await keybord(user.lng, 'on_off');
    await botjs.sendMSG(id, text, btns, false);
} else {
    await udb.updateUser(id, user.referers, user.lng, user.status, lng[user.lng].home, user.referer_code);
    text = lng[user.lng].rate_not_valid;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
}
} else if (user.lng && lng[user.lng] && user.status.indexOf('rate_') > -1) {
    let arr = user.status.split('_')[1];
    let login = arr.split(':')[0];
    let amount = parseFloat(arr.split(':')[1]);
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc) {
        text = lng[user.lng].rate_false;
        if (message === lng[user.lng].on) {
try {
    if (user.posting_key !== '') {
await biddb.addBid(login, amount);

let posting_key = sjcl.decrypt(login + '_postingKey_stakebot', acc.posting_key);
        await methods.donate(posting_key, login, conf.stakebot.golos_login, amount.toFixed(3) + ' GOLOS', 'Ставка в golos_stake_bot.');
            text = lng[user.lng].rate_true;
        } else {
            text = lng[user.lng].posting_not_valid;
        }
} catch(e) {
    text = lng[user.lng].rate_error + e;
}
}
    }                        
    await udb.updateUser(id, user.referers, user.lng, user.status, 'sended_rate', user.referer_code);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns, false);
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
text += `
${lng[user.lng].about_bids}`;
let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(parseInt(id), text, btns, false);
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
    text += `
${lng[user.lng].about_bids}`;    
    let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(parseInt(id), text, btns, false);
    await helpers.sleep(500);
    }
    } catch(e) {
        console.log(JSON.stringify(e));
        continue;
    }
}    
}       
}

async function sendReplayVoteNotify(members) {
    for (let id in members) {
            try {
            let user = await udb.getUser(parseInt(id));
    if (user) {
        let info = members[id].text;
        let post = members[id].unvote_data;
        let text = `${info}

${lng[user.lng].about_bids}`;
let btns = await keybord(user.lng, 'unvote@' + post);
await botjs.sendMSG(parseInt(id), text, btns, true);
}    
    await helpers.sleep(500);
    } catch(e) {
        console.log(e);
        continue;
    }
        }       
    }

    async function sendFavoritsVoteNotify(members) {
        for (let id in members) {
            try {
            let user = await udb.getUser(parseInt(id));
    if (user) {
        let info = members[id].text;
        let post = members[id].unvote_data;
                let text = `${info}

${lng[user.lng].about_bids}`;
let btns = await keybord(user.lng, 'unvote@' + post);
        await botjs.sendMSG(parseInt(id), text, btns, true);
    }
        await helpers.sleep(500);
    } catch(e) {
        console.log(JSON.stringify(e));
        continue;
    }
        }       
    }

async function sendBidsNotify(bids, proof, winner) {
    if (bids && bids.length > 0) {
        let text = '';
        for (let n in bids) {
            let my_acc = await adb.getAccount(bids[n].login);
            if (my_acc) {
                let user = await udb.getUser(parseInt(my_acc.id));
                if (user) {
                if (bids[n].status == true) {
            text = `${lng[user.lng].rate_msg1} ${bids[n].login} ${lng[user.lng].rate_msg2} ${parseInt(n)+1}!
${lng[user.lng].proof}: ${proof}`;
        } else {
            text = `${lng[user.lng].rate_msg3} ${parseInt(n)+1}. ${lng[user.lng].rate_msg4} ${winner}.
            ${lng[user.lng].proof}: ${proof}`;
        }
                let btns = await keybord(user.lng, 'home');
                        await botjs.sendMSG(parseInt(my_acc.id), text, btns, false);
    }
                        await helpers.sleep(500);
                        }
    }
}
}

async function sendJackpotNotify(users, proof, winner) {
    if (users && users.length > 0) {
        let text = '';
        for (let n in users) {
            let my_acc = await adb.getAccount(users[n].login);
            if (my_acc) {
                let user = await udb.getUser(parseInt(my_acc.id));
                if (user) {
                if (users[n].status == true) {
            text = `${lng[user.lng].jackpot_msg1} ${users[n].login} ${lng[user.lng].jackpot_msg2} ${parseInt(n)+1}!
            ${lng[user.lng].proof}: ${proof}`;
        } else {
            text = `${lng[user.lng].jackpot_msg3} ${parseInt(n)+1}. ${lng[user.lng].jackpot_msg4} ${winner}.
            ${lng[user.lng].proof}: ${proof}`;
        }
                let btns = await keybord(user.lng, 'home');
                        await botjs.sendMSG(parseInt(my_acc.id), text, btns, false);
    }
                        await helpers.sleep(500);
                        }
    }
}
}

        module.exports.main = main;
        module.exports.sendClaimNotify = sendClaimNotify;
        module.exports.sendReplayVoteNotify = sendReplayVoteNotify;
        module.exports.sendFavoritsVoteNotify = sendFavoritsVoteNotify;
        module.exports.sendBidsNotify = sendBidsNotify;
        module.exports.sendJackpotNotify = sendJackpotNotify;