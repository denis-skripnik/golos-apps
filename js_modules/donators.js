const helpers = require("./helpers");
const methods = require("./methods");
const udb = require("../databases/donates/usersdb");
const pdb = require("../databases/donates/postsdb");
const cdb = require("../databases/donates/commentsdb");
const dcdb = require("../databases/donates/donators_contentdb");
const tdb = require("../databases/donates/tokensdb");

async function workingDonateWithNoPost(from, fullAmount) {
    let prefix = new Date().getUTCMonth()+1 + '_' + new Date().getUTCFullYear();
    let donate = fullAmount.split(' ');
let amount = parseFloat(donate[0]);
let token = donate[1];
let get_token = await tdb.getToken(token);
if (!get_token && token !== 'GOLOS' && token !== 'GBG') {
    await tdb.updateTokens(token)
}

let user = await udb.getUser(from, token, prefix);
if (user) {
    await udb.updateUser(from, token, user.amount+amount, prefix);
    return 1;    
        } else {
            await udb.updateUser(from, token, amount, prefix);
            return 1;    
            }

}

async function workingDonate(from, author, permlink, fullAmount) {
    let prefix = new Date().getUTCMonth()+1 + '_' + new Date().getUTCFullYear();
    let content = await methods.getContent(author, permlink);
    if (content) {
        let donate = fullAmount.split(' ');
        let amount = parseFloat(donate[0]);
        let token = donate[1];
        let get_token = await tdb.getToken(token);
if (!get_token && token !== 'GOLOS' && token !== 'GBG') {
    await tdb.updateTokens(token)
}
        
console.log('Донатер: ' + from);
        let gdoc = await dcdb.getDonatorsOneContent(token, from, author, permlink, prefix)
    if (gdoc) {
        await dcdb.updateDonatorsOneContent(token, from, author, permlink, gdoc.amount+amount, prefix);
    } else {
        await dcdb.updateDonatorsOneContent(token, from, author, permlink, amount, prefix);
    }

    if (content.code === 1) {
        let user = await udb.getUser(from, token, prefix);
        console.log('Пользователь: ' + JSON.stringify(user));
        if (user) {
            await udb.updateUser(from, token, user.amount+amount, prefix);
                    } else {
                        await udb.updateUser(from, token, amount, prefix);
                    }
        
        let post = await pdb.getPost(token, author, permlink, prefix);
        if (post) {
        await pdb.updatePost(token, author, permlink, content.title, post.amount + amount, prefix);
        } else {
            await pdb.updatePost(token, author, permlink, content.title, amount, prefix);
        }
        return 1;    
            } else if (content.code === 2) {
                let donate = fullAmount.split(' ');
            let amount = parseFloat(donate[0]);
            let token = donate[1];
            let get_token = await tdb.getToken(token);
if (!get_token && token !== 'GOLOS' && token !== 'GBG') {
    await tdb.updateTokens(token)
}
            
            console.log('Донатер: ' + from);
            let user = await udb.getUser(from, token, prefix);
            console.log('Пользователь: ' + JSON.stringify(user));
            if (user) {
                await udb.updateUser(from, token, user.amount+amount, prefix);
                        } else {
                            await udb.updateUser(from, token, amount, prefix);
                        }
            
            let comment = await cdb.getComment(token, author, permlink, prefix);
            if (comment) {
            await cdb.updateComment(token, author, permlink, content.title, comment.amount + amount, prefix);
            } else {
                await cdb.updateComment(token, author, permlink, content.title, amount, prefix);
            }
            return 1;    
        } else {
        console.log('Это не пост и не комментарий.');
        return 0;    
        } // End content types.
    } else {
        console.log('Пост или комментарий не найден.');
        return 0;    
    }
}

async function donateOperation(op, opbody) {
    var ok_ops_count = 0;
    try {
        let arr = opbody.memo;
        if (arr.app === 'golos-id' && arr.version === 1) {
        let donate = arr.target;
        let url;
        if (opbody.to === donate.author && donate.permlink !== '') {
        console.log('автор: ' + donate.author + ', Пермлинк: ' + donate.permlink);
        let result = await workingDonate(opbody.from, donate.author, donate.permlink, opbody.amount);
        ok_ops_count += result;
        } else if (opbody.to === donate.author && donate.permlink === '' && arr.comment !== '') {
            let result = await workingDonateWithNoPost(opbody.from, opbody.amount);
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