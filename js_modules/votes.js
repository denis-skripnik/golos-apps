const helpers = require("./helpers");
const methods = require("./methods");
const votes = require("../databases/votesdb");
const vadb = require("../databases/vadb");
const conf = require('../config.json');

async function transferOperation(timestamp, op, opbody) {
        opbody.memo = opbody.memo.replace(/\s+/g, ' ').trim();
        let ok_ops_count = 0;
        try {
        let isJson = await helpers.isJsonString(opbody.memo);
if (isJson.approve === true && opbody.to === 'null' && opbody.amount.indexOf('GBG') > -1 && parseFloat(opbody.amount) >= parseFloat(conf.votes.vote_price) && isJson.data && isJson.data.contractName === 'golos-votes') {
let arr = isJson.data;
if (arr.contractAction === 'createVote' && arr.contractPayload && arr.contractPayload.question && arr.contractPayload.answers && typeof arr.contractPayload.consider != undefined) {
    if (!arr.contractPayload.end_date) {
        let nowUnixTime = await helpers.unixTime();
        arr.contractPayload.end_date = nowUnixTime + 432000;
    }
                try {
    let permlink = 'survey-' + parseInt(new Date(timestamp).getTime()/1000);
let status = await votes.addVote(arr.contractPayload.question, arr.contractPayload.answers, permlink, arr.contractPayload.consider, arr.contractPayload.end_date);
let title = 'Вопрос: ' + arr.contractPayload.question;
let answers_list = '';
for (let answer of arr.contractPayload.answers) {
answers_list += `- ${answer};
`;
}
let body = `## Варианты ответа:
${answers_list}
`;
await methods.publickPost(title, permlink, body, arr.contractPayload.answers, arr.contractPayload.end_date)
ok_ops_count += 1;
} catch(err) {
console.log(err);
}
} // action createVote.
    }
} catch(e) {
console.log(e);
}
return ok_ops_count;
    }
    
    async function customJsonOperation(op, opbody) {
        let ok_ops_count = 0;
        try {
            let arr = JSON.parse(opbody.json);
    if (opbody.id === 'golos-votes' && arr.contractAction === 'voteing' && arr.contractPayload && arr.contractPayload.votePermlink && arr.contractPayload.answerId) {
let nowUnixTime = await helpers.unixTime();
        let isVote = await votes.getVoteByPermlink(arr.contractPayload.votePermlink);
    if (isVote && isVote.end_date > nowUnixTime && isVote.answers.length-1 >= arr.contractPayload.answerId) {
    let acc = await methods.getAccount(opbody.required_posting_auths[0]);
    let gests = 0;
    let gests_str = '';
    if (isVote.consider && isVote.consider === 0 || isVote.consider === "0") {
    gests = parseFloat(acc[0].vesting_shares);
    gests_str = 'Учитывается только личная СГ';
    } else if (isVote.consider && isVote.consider === 1 || isVote.consider === "1") {
    gests = parseFloat(acc[0].vesting_shares) + parseFloat(acc[0].proxied_vsf_votes[0]/1000000);
    gests_str = 'Учитывается личная + прокси СГ';
    } else if (isVote.consider && isVote.consider === 2 || isVote.consider === "2") {
    gests = parseFloat(acc[0].vesting_shares) + parseFloat(acc[0].received_vesting_shares) - parseFloat(acc[0].delegated_vesting_shares);
    gests_str = 'Учёт СГ аналогично апвотам.';
    } else {
    gests = parseFloat(acc[0].vesting_shares);
    gests_str = 'Учитывается только личная СГ';
    }
    let status = await vadb.updateVa(arr.contractPayload.votePermlink, arr.contractPayload.answerId, opbody.required_posting_auths[0], gests);
    if (status === 1) {
    let title = 'Вопрос: ' + isVote.question;
    let permlink = isVote.permlink;
    let voteRes = await vadb.findVa(isVote.permlink);
    let all_gests = 0;
    let variants = [];
    let users = [];
    for (let vote of voteRes) {
    all_gests += vote.gests;
    if (!variants[vote.answer_id]) {
    variants[vote.answer_id] = vote.gests;
    } else {
    variants[vote.answer_id] += vote.gests;
    }
    if (!users[vote.answer_id]) {
    users[vote.answer_id] = [];
    users[vote.answer_id].push({login: vote.login, gests: vote.gests});
    } else {
    users[vote.answer_id].push({login: vote.login, gests: vote.gests});
    }
    }
    let percents = [];
    for (let n in variants) {
    percents[n] = ((variants[n] / all_gests) * 100).toFixed(2);
    }
    
    let a = new Date(isVote.end_date * 1000);
    let months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let voteEndTime = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    let results = `${gests_str}
    Дата и время окончания: ${voteEndTime}.
    
    | Вариант ответа | процент |
    | --- | --- |
    `;
    for (let num in percents) {
    results += `| ${isVote.answers[num]} | ${percents[num]}% |
    `;
    }
    results += `## Топ 100 пользователей по СГ (каждый вариант, за который есть голоса)
    `;
    for (let n in users) {
    users[n].sort(helpers.compareGests);
    let list_str = '';
    for (let user of users[n]) {
    list_str += `[${user.login}](https://golos.id/@${user.login}), `;
    }
    list_str = list_str.replace(/,\s*$/, "");
    results += `### За вариант "${isVote.answers[n]}" проголосовали:
    ${list_str}
    `;
    }
    await methods.publickPost(title, permlink, results, isVote.answers, isVote.end_date);
    } // status
    } // isVote.            
    } // Action voteing.
    ok_ops_count += 1;
    } catch(e) {
    console.log(e);
    }
    return ok_ops_count;
    }
    
module.exports.transferOperation = transferOperation;
module.exports.customJsonOperation = customJsonOperation;