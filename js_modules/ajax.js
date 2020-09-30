let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const pdb = require("../databases/donates/postsdb");
const cdb = require("../databases/donates/commentsdb");
const udb = require("../databases/donates/usersdb");
const dcdb = require("../databases/donates/donators_contentdb");
const rdb = require("../databases/referrersdb");
const rldb = require("../databases/referrerslistdb");
const gudb = require("../databases/golos_usersdb");
const votes = require("../databases/votesdb");
const vadb = require("../databases/vadb");
const asdb = require("../databases/asdb");
const prdb = require("../databases/prdb");
const conf = require('../config.json');

app.get('/golos-api/', async function (req, res) {
    let service = req.query.service;
    let type = req.query.type;
    let page = req.query.page;
let date = req.query.date; // получили параметр date из url
let token = req.query.token; // получили параметр date из url
if (token) {
    token = token.toUpperCase();
}
let login = req.query.login; // получили параметр login из url
let permlink = req.query.permlink; // получили параметр user из url
if (service === 'referrers' && type === 'list') {
let referrers = await rdb.findAllReferrers();
if (referrers && referrers.length > 0) {
    referrers.sort(helpers.compareReferrers);
    res.send(JSON.stringify(referrers));
}
} else if (service === 'referrers' && type === 'one' && login) {
    let referals = await rldb.getReferrer(login);
    if (referals) {
        res.send(JSON.stringify(referals));
    }
} else if (service === 'donates') {
    if (type === 'donators' && token) {
    if (!date) {
        date = new Date().getMonth()+1 + '_' + new Date().getFullYear();
        let users = await udb.findAllUsers(token, date);
    users.sort(helpers.compareDonators);
    let usersArray = [];
    for (let user of users) {
        usersArray.push({login: user.login, amount: user.amount});
    }
    res.send(JSON.stringify(usersArray));
    } else {
        let users = await udb.findAllUsers(token, date);
    users.sort(helpers.compareDonators);
    let usersArray = [];
    for (let user of users) {
        usersArray.push({login: user.login, amount: user.amount});
    }
    res.send(JSON.stringify(usersArray));
    }
} else if (type === 'posts') {
    if (!date) {
        date = new Date().getMonth()+1 + '_' + new Date().getFullYear();
    let posts = await pdb.findAllPosts(token, date);
posts.sort(helpers.comparePosts);
let postsArray = [];
for (let post of posts) {
    postsArray.push({link: `<a href="https://golos.id/@${post.author}/${post.permlink}" target="_blank">${post.title}</a>`, amount: post.amount});
}
res.send(JSON.stringify(postsArray));
} else {
    let posts = await pdb.findAllPosts(token, date);
posts.sort(helpers.comparePosts);
let postsArray = [];
for (let post of posts) {
    postsArray.push({link: `<a href="https://golos.id/@${post.author}/${post.permlink}" target="_blank">${post.title}</a>`, amount: post.amount});
}
res.send(JSON.stringify(postsArray));
}
} else if (type === 'comments') {
    if (!date) {
        date = new Date().getMonth()+1 + '_' + new Date().getFullYear();
    let comments = await cdb.findAllComments(token, date);
comments.sort(helpers.comparePosts);
let commentsArray = [];
for (let comment of comments) {
    commentsArray.push({link: `<a href="https://golos.id/@${comment.author}/${comment.permlink}" target="_blank">@${comment.author}/${comment.permlink}</a>`, amount: comment.amount});
}
res.send(JSON.stringify(commentsArray));
} else {
    let comments = await cdb.findAllComments(token, date);
comments.sort(helpers.comparePosts);
let commentsArray = [];
for (let comment of comments) {
    commentsArray.push({link: `<a href="https://golos.id/@${comment.author}/${comment.permlink}" target="_blank">@${comment.author}/${comment.permlink}</a>`, amount: comment.amount});
}
res.send(JSON.stringify(commentsArray));
}
} else if (type === 'donators-content' && login) {
    if (!date) {
        date = new Date().getMonth()+1 + '_' + new Date().getFullYear();
    }
        let content = await dcdb.findAllDonatorContent(login, token, date);
content.sort(helpers.comparePosts);
let contentArray = [];
for (let el of content) {
    contentArray.push({link: `<a href="https://golos.id/@${el.author}/${el.permlink}" target="_blank">@${el.author}/${el.permlink}</a>`, amount: el.amount});
}
res.send(JSON.stringify(contentArray));
}
} else if (service === 'top' && type && page) {
        let data = await gudb.getTop(type, page);
        let users = [];
        if (data && data.length > 0) {
            let collums = {};
            collums['gp'] = ['gp', 'gp_percent', 'delegated_gp', 'received_gp', 'effective_gp', 'tip_balance', 'golos', 'golos_percent', 'gbg', 'gbg_percent', 'reputation'];
            collums['delegated_gp'] = ['delegated_gp', 'gp', 'gp_percent', 'received_gp', 'effective_gp', 'tip_balance', 'golos', 'golos_percent', 'gbg', 'gbg_percent', 'reputation'];
            collums['received_gp'] = ['received_gp', 'gp', 'gp_percent', 'delegated_gp', 'effective_gp', 'tip_balance', 'golos', 'golos_percent', 'gbg', 'gbg_percent', 'reputation'];
            collums['effective_gp'] = ['effective_gp', 'gp', 'gp_percent', 'delegated_gp', 'received_gp', 'tip_balance', 'golos', 'golos_percent', 'gbg', 'gbg_percent', 'reputation'];
            collums['tip_balance'] = ['tip_balance', 'gp', 'gp_percent', 'delegated_gp', 'received_gp', 'effective_gp', 'golos', 'golos_percent', 'gbg', 'gbg_percent', 'reputation'];
            collums['golos'] = ['golos', 'golos_percent', 'gbg', 'gbg_percent', 'gp', 'gp_percent', 'delegated_gp', 'received_gp', 'effective_gp', 'tip_balance', 'reputation'];
            collums['gbg'] = ['gbg', 'gbg_percent', 'golos', 'golos_percent', 'gp', 'gp_percent', 'delegated_gp', 'received_gp', 'effective_gp', 'tip_balance', 'reputation'];
            collums['reputation'] = ['reputation', 'gp', 'gp_percent', 'delegated_gp', 'received_gp', 'effective_gp', 'tip_balance', 'golos', 'golos_percent', 'gbg', 'gbg_percent'];
            let users_count = 0;
            for (let user of data) {
                    users[users_count] = {};
                    users[users_count]['name'] = user['name'];
for (let collum of collums[type]) {
    users[users_count][collum] = user[collum];
}
            users_count++;
            } // end for.
        } // end if data.
        res.send(users);
} else if (service === 'votes') {
    if (type === 'list') {
        let allVotes = await votes.findVotes();
    let data = [];
        for (let oneVote of allVotes) {
    data.push({question: oneVote.question, answers: oneVote.answers, permlink: oneVote.permlink, end_date: oneVote.end_date})
    }
    res.send(data);
    } else if (type === 'voteing' && permlink) {
    try {
        let isVote = await votes.getVoteByPermlink(permlink);
        let data = {};
        if (isVote) {
    data.question = isVote.question;
    data.answers = isVote.answers;
    data.end_date = isVote.end_date;
        }
        res.send(data);
    } catch (err) {
        res.send(err);
         console.error(err)
    }
    } else if (type === 'vote' && permlink) {
        let results = {};
        let isVote = await votes.getVoteByPermlink(permlink);
        if (isVote) {
    let voteRes = await vadb.findVa(isVote.permlink);
    let all_gests = 0;
    let gests_str = '';
    if (isVote.consider && isVote.consider === 0 || isVote.consider === "0") {
    gests_str = 'При расчёте результатов учитывается только личная СГ';
    } else if (isVote.consider && isVote.consider === 1 || isVote.consider === "1") {
        gests_str = 'При расчёте результатов учитывается личная + прокси СГ';
    } else if (isVote.consider && isVote.consider === 2 || isVote.consider === "2") {
        gests_str = 'При расчёте результатов учёт СГ аналогичен апвотам.';
    } else {
        gests_str = 'При расчёте результатов учитывается только личная СГ';
    }
    
    let variants = [];
    let voters = [];
    for (let vote of voteRes) {
    all_gests += vote.gests;
    if (!variants[vote.answer_id]) {
        variants[vote.answer_id] = vote.gests;
    } else {
    variants[vote.answer_id] += vote.gests;
    }
    if (!voters[vote.answer_id]) {
        voters[vote.answer_id] = [];
        voters[vote.answer_id].push({login: vote.login, gests: vote.gests});
    } else {
        voters[vote.answer_id].push({login: vote.login, gests: vote.gests});
    }
    }
    let percents = [];
    for (let n in variants) {
    percents[n] = ((variants[n] / all_gests) * 100).toFixed(2);
    }
    results.question = isVote.question;
    results.end_date = isVote.end_date
    results.all_gests = all_gests;
    results.type = gests_str;
    results.variants = [];
    results.voters = [];
        for (let num in percents) {
            voters[num].sort(helpers.compareGests);
            let list_str = '';
            for (let voter of voters[num]) {
                list_str += `<a href="https://dpos.space/golos/profiles/${voter.login}" target="_blank">${voter.login}</a>, `;
                }
                list_str = list_str.replace(/,\s*$/, "");
            results.variants.push({answer: isVote.answers[num], percent: percents[num], gests: variants[num], voters: list_str});
    }
        } // isVote.            
    res.send(results);
    }
} else if (service === 'activity_stats') {
        let data = await asdb.findAllActivityStats();
        if (data && data.length > 0) {
            res.send(data);
        } else {
            res.send({});
        }
} else if (service === 'witnesses') {
    let data = await prdb.findAllWitnesses();
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.send({});
    }
}
});
app.listen(3000, function () {
});