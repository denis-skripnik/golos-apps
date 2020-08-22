const helpers = require("./helpers");
const methods = require("./methods");
const udb = require("../databases/usersdb");
const pdb = require("../databases/postsdb");
const cdb = require("../databases/commentsdb");

async function workingDonateWithNoPost(from, fullAmount) {
    let prefix = new Date().getUTCMonth()+1 + '_' + new Date().getUTCFullYear();
    let donate = fullAmount.split(' ');
let amount = parseFloat(donate[0]);
let token = donate[1];
let user = await udb.getUser(from, prefix);
if (user && token === 'GBG') {
    await udb.updateUser(from, user.golos_amount, user.gbg_amount+amount, prefix);
    return 1;    
} else if (user && token === 'GOLOS') {
    await udb.updateUser(from, user.golos_amount + amount, user.gbg_amount, prefix);
    return 1;    
} else if (!user && token === 'GBG') {
        await udb.updateUser(from, 0, amount, prefix);
        return 1;    
    } else if (!user && token === 'GOLOS') {
            await udb.updateUser(from, amount, 0, prefix);
            return 1;    
        } else {
console.log('Условию не соответствует: ' + JSON.stringify(user));
return 0;
            }

}

async function workingDonate(from, author, permlink, fullAmount) {
    let prefix = new Date().getUTCMonth()+1 + '_' + new Date().getUTCFullYear();
    let content = await methods.getContent(author, permlink);
    if (content.code === 1) {
    let donate = fullAmount.split(' ');
let amount = parseFloat(donate[0]);
let token = donate[1];
console.log('Донатер: ' + from);
let user = await udb.getUser(from, prefix);
console.log('Пользователь: ' + JSON.stringify(user));
if (user && token === 'GBG') {
    await udb.updateUser(from, user.golos_amount, user.gbg_amount+amount, prefix);
} else if (user && token === 'GOLOS') {
    await udb.updateUser(from, user.golos_amount + amount, user.gbg_amount, prefix);
    } else if (!user && token === 'GBG') {
        await udb.updateUser(from, 0, amount, prefix);
        } else if (!user && token === 'GOLOS') {
            await udb.updateUser(from, amount, 0, prefix);
            } else {
console.log('Условию не соответствует: ' + JSON.stringify(user));
            }

let post = await pdb.getPost(author, permlink, prefix);
if (post && token === 'GBG') {
await pdb.updatePost(author, permlink, content.title, post.golos_amount, post.gbg_amount + amount, prefix);
} else if (post && token === 'GOLOS') {
    await pdb.updatePost(author, permlink, content.title, post.golos_amount + amount, post.gbg_amount, prefix);
} else if (!post && token === 'GBG') {
    await pdb.updatePost(author, permlink, content.title, 0, amount, prefix);
} else if (!post && token === 'GOLOS') {
    await pdb.updatePost(author, permlink, content.title, amount, 0, prefix);
}
return 1;    
    } else if (content.code === 2) {
        let donate = fullAmount.split(' ');
    let amount = parseFloat(donate[0]);
    let token = donate[1];
    console.log('Донатер: ' + from);
    let user = await udb.getUser(from, prefix);
    console.log('Пользователь: ' + JSON.stringify(user));
    if (user && token === 'GBG') {
        await udb.updateUser(from, user.golos_amount, user.gbg_amount+amount, prefix);
    } else if (user && token === 'GOLOS') {
        await udb.updateUser(from, user.golos_amount + amount, user.gbg_amount, prefix);
        } else if (!user && token === 'GBG') {
            await udb.updateUser(from, 0, amount, prefix);
            } else if (!user && token === 'GOLOS') {
                await udb.updateUser(from, amount, 0, prefix);
                } else {
    console.log('Условию не соответствует: ' + JSON.stringify(user));
                }
    
    let comment = await cdb.getComment(author, permlink, prefix);
    if (comment && token === 'GBG') {
    await cdb.updateComment(author, permlink, content.title, comment.golos_amount, comment.gbg_amount + amount, prefix);
    } else if (comment && token === 'GOLOS') {
        await cdb.updateComment(author, permlink, content.title, comment.golos_amount + amount, comment.gbg_amount, prefix);
    } else if (!comment && token === 'GBG') {
        await cdb.updateComment(author, permlink, content.title, 0, amount, prefix);
    } else if (!comment && token === 'GOLOS') {
        await cdb.updateComment(author, permlink, content.title, amount, 0, prefix);
    }
    return 1;    
} else {
console.log('Пост не найден.');
return 0;    
}        
}

async function donateOperation(op, opbody) {
    var ok_ops_count = 0;
    try {
        let arr = opbody.memo;
        if (arr.app === 'golos-id' && arr.version === 1 && arr.target.permlink !== '') {
        let donate = arr.target;
        let url;
        if (opbody.to === donate.author) {
        console.log('автор: ' + donate.author + ', Пермлинк: ' + donate.permlink);
        let result = await workingDonate(opbody.from, donate.author, donate.permlink, opbody.amount);
        ok_ops_count += result;
        }     else {
        console.log('Получатель не совпадает с автором.');
        }
        } else {
            if (arr.comment !== '') {
            let result = await workingDonateWithNoPost(opbody.from, opbody.amount);
            ok_ops_count += result;
            } else {
                ok_ops_count += 0;
            }
        }
            } catch(e) {
            console.log(e);
            }
return ok_ops_count;
        }

async function transferOperation(op, opbody) {
    opbody.memo = opbody.memo.replace(/\s+/g, ' ').trim();
    try {
    let isJson = await helpers.isJsonString(opbody.memo);
if (isJson.approve === true) {
let arr = isJson.data;
if (arr.donate) {
let donate = arr.donate.post;
let url;
if (donate.indexOf('#') > -1) {
let comment = donate.split('#')[1];
let filtered_memo = comment.split('@')[1];
url = filtered_memo.split('/');
} else {
let filtered_memo = donate.split('@')[1];
url = filtered_memo.split('/');
}
if (opbody.to === url[0]) {
console.log('автор: ' + url[0] + ', Пермлинк: ' + url[1]);
let result = await workingDonate(opbody.from, url[0], url[1], opbody.amount);
ok_ops_count += result;
}     else {
console.log('Получатель не совпадает с автором.');
}
}
} else {
let memo = opbody.memo.toLowerCase();
    if (memo.indexOf('донат') > -1 || memo.indexOf('donate') > -1 || memo.indexOf('спасибо') > -1 || memo.indexOf('благодарю') > -1 || memo.indexOf('нравится') > -1 || memo.indexOf('отлично') > -1 || memo.indexOf('молодец') > -1 || memo.indexOf('молодцы') > -1) {
    let result = await workingDonateWithNoPost(opbody.from, opbody.amount);
    ok_ops_count += result;
    }
}
} catch(e) {
console.log(e);
}
}

module.exports.donateOperation = donateOperation;
module.exports.transferOperation = transferOperation;