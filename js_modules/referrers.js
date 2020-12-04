const helpers = require("./helpers");
const methods = require("./methods");
const rdb = require("../databases/referrersdb");
const rldb = require("../databases/referrerslistdb");

async function accountCreateWithDelegationOperation(op, opbody) {
    var ok_ops_count = 0;
    try {
        if (opbody.extensions) {
                    let referrer = opbody.extensions[0][1].referrer;
let data = await rdb.getReferrer(referrer);
let counter = 1;
if (data) {
counter += data.count;
}
await rdb.updateReferrer(referrer, counter);
let list = await rldb.getReferrer(referrer);
let referals = [];
if (list) {
referals = list.referals;
referals.push(opbody.new_account_name);
} else {
referals.push(opbody.new_account_name);
}
await rldb.updateReferrer(referrer, referals);
}
ok_ops_count += 1;
} catch(e) {
            console.log(JSON.stringify(e));
                }                        
        return ok_ops_count;
}

async function accountCreateWithInviteOperation(op, opbody) {
    var ok_ops_count = 0;
    try {
        let accounts = await methods.getAccount(opbody.new_account_name);
                if (accounts && accounts.length > 0) {
                    let acc = accounts[0];
                    let referrer = acc.referrer_account;
let data = await rdb.getReferrer(referrer);
let counter = 1;
if (data) {
counter += data.count;
}
await rdb.updateReferrer(referrer, counter);
let list = await rldb.getReferrer(referrer);
let referals = [];
if (list) {
referals = list.referals;
referals.push(opbody.new_account_name);
} else {
referals.push(opbody.new_account_name);
}
await rldb.updateReferrer(referrer, referals);
}
ok_ops_count += 1;
} catch(e) {
            console.log(JSON.stringify(e));
                }                        
        return ok_ops_count;
}

module.exports.accountCreateWithDelegationOperation = accountCreateWithDelegationOperation;
module.exports.accountCreateWithInviteOperation = accountCreateWithInviteOperation;