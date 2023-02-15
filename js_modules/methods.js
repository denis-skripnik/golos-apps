var conf = require('../config.json');
var golos = require('golos-lib-js');
golos.config.set('websocket',conf.node);
let keccak = require("keccak");
let BigI = require("big-integer");

async function getEventsInBlock(bn) {
    return await golos.api.getEventsInBlockAsync(bn, false);
  }

  async function getBlockHeader(block_num) {
  return await golos.api.getBlockHeaderAsync(block_num);
  }

  async function getTransaction(trxId) {
    return await golos.api.getTransactionAsync(trxId);
    }
  
    async function getConfig() {
        return await golos.api.getConfigAsync();
        }

        let time_start = new Date().getTime();
  let properties = {};
        async function getProps() {
      let old_time = time_start;
    time_start = new Date().getTime();
let time_call = time_start - old_time;
    if (time_call < 0) time_call = 0;
    if (time_call === 0 || time_call >= 3000 || Object.keys(properties).length === 0) {
    properties = await golos.api.getDynamicGlobalPropertiesAsync();
}
return properties;
      }

      async function updateAccount(service) {
let test_user = '';
let pk = '';
        let 					metadata={};
        metadata.profile={};
                if (service === 'votes') {
        metadata.profile.name = 'Опросы и референдумы';
            metadata.profile.about= `Опросы и референдумы на Голосе. Создание путём отправки к null от ${conf.vote_price} с определённым кодом (рекомендуем пользоваться интерфейсом на dpos.space)`;
            metadata.profile.website = 'https://dpos.space/golos-polls';
        test_user = conf[service].login;
        pk = conf[service].posting_key;
        }
            let json_metadata=JSON.stringify(metadata);
        return await golos.broadcast.accountMetadataAsync(pk,test_user,json_metadata);
    }
    
    async function getAccount(login) {
        return await golos.api.getAccountsAsync([login]);
        }
    
        async function getTicker() {
            return await golos.api.getTickerAsync();
            }
            
    async function getContent(author, permlink) {
try {
let post = await golos.api.getContentAsync(author, permlink, 10000, 0);
if (post.author === '' && post.permlink === '') return {code: -1, error: 'Post or comment was not found'};
let edit = true;
if (post.created === post.active) edit = false;
let ended = false;
if (post.last_payout !== '1970-01-01T00:00:00') ended = true;
if (post.parent_author === '') {
let votes = [];
if (post.active_votes && post.active_votes.length > 0) {
    for (let vote of post.active_votes) {
        votes.push(vote.voter);
    }
}
return {code: 1, title: post.title, created: post.created, edit, ended, id: post.id, votes, parent_permlink: post.parent_permlink};
} else {
    return {code: 2, title: post.title, created: post.created, edit, ended};
}
} catch(e) {
return {code: -1, error: e};
}
}

async function publickPost(title, permlink, main_data, answers, end_date) {
    let wif = conf.votes.posting_key;
    let parentAuthor = conf.votes.login;
    let parentPermlink = 'votes-list';
    let author = conf.votes.login;
    let now = new Date();
    let body = `## ${title}
Опрос создан при помощи @${conf.login}.
Проголосовать можно [тут](https://dpos.space/golos-polls/voteing/${permlink}), а посмотреть предварительные или окончательные результаты [здесь](https://dpos.space/golos-polls/results/${permlink}) или ниже, если опрос завершён.
    
${main_data}

Сервис создан незрячим разработчиком @denis-skripnik.`;
    
    let json_metadata = {};
    json_metadata.app = 'golos-votes/1.0';
    json_metadata.answers = answers;
    json_metadata.end_date = end_date;
    let jsonMetadata = JSON.stringify(json_metadata);
    let post = await golos.broadcast.commentAsync(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata);
return post;
}

async function sendPost(wif, author, title, parent_permlink, permlink, body) {
    let json_metadata = {};
    json_metadata.app = 'golos-stake-bot/3.0';
    let jsonMetadata = JSON.stringify(json_metadata);
    let post = await golos.broadcast.commentAsync(wif, '', parent_permlink, author, permlink, title, body, jsonMetadata);
return post;
}

function getDelegations() {
    return new Promise((resolve, reject) => {
        golos.api.getVestingDelegations(conf.login, -1, 1000, 'received', function(err, data) {
            if(err) {
                reject(err);
         } else {
                resolve(data);
         }
        });
    });
}

async function lookupAccounts(curr_acc) {
    return await golos.api.lookupAccountsAsync(curr_acc, 100);
}

async function getAccounts(accs) {
    return await golos.api.getAccountsAsync(accs);
}

async function getReputation(reputation) {
    if (reputation[reputation.length-1] === 0) reputation /= 10;
    return golos.formatter.reputation(reputation, true);
}

async function send(operations, posting) {
    return await golos.broadcast.sendAsync({extensions: [], operations}, [posting]);
}

async function wifToPublic(key) {
    return golos.auth.wifToPublic(key);
}

async function donate(posting_key, account, donate_to, donate_amount, donate_memo, author, permlink) {
let memo = {app: 'golos-stake-bot', version: 1, comment: donate_memo, target: {type: 'personal_donate'}}
    if (typeof author !== 'undefined' && typeof permlink !== 'undefined') {
        memo.version = 2;
        memo.target = {type: 'content_donate', author, permlink}
            }
return golos.broadcast.donateAsync(posting_key, account, donate_to, donate_amount, memo, []);
}

async function getBlockSignature(block) {
    var b = await golos.api.getBlockAsync(block);
    if(b && b.witness_signature) {
        return b.witness_signature;
    } 
    throw "unable to retrieve signature for block " + block;
}

async function randomGenerator(start_block, end_block, maximum_number) {
    let hasher = new keccak("keccak256");
    let sig = await getBlockSignature(end_block);
    let prevSig = await getBlockSignature(start_block);
    hasher.update(prevSig + sig);
        let sha3 = hasher.digest().toString("hex");
    let random = BigI(sha3, 16).mod(maximum_number);
    return random;
}

async function getBalances(accounts) {
    try {
        let assets = await golos.api.getAccountsBalancesAsync(accounts);
if (assets && assets.length > 0) {
return assets;
} else {
    return false;
}
        } catch(e) {
        console.log('Uia error: ' + e);
    return false;
    }
                }

async function getFeed(login, last_post) {
return await golos.api.getFeedAsync(login, last_post, 100);
}

async function getFollowing(login, start, fl) {
    let f = await golos.api.getFollowingAsync(login, start, 'blog', 100);
    let index = 0;
if (start !== -1) index = 1;
let following = '';
    for (let i = index; i < f.length; i++) {
following = f[i].following;
fl.push(following);
    }
let l = fl;
if (f.length === 1) {
    l = await getFollowing(login, following, fl);
}
return l;
}

async function getFollowingList(login) {
try {
    return await getFollowing(login, -1, []);
} catch(e) {
    console.error(e);
    return 'error';
}
}

async function vote(posting_key, account, author, permlink, percent) {
    percent *= 100;
    percent = parseInt(percent);
    if (percent > 100) percent = 100;
    return golos.broadcast.voteAsync(posting_key, account, author, permlink, percent);
}

async function getWitnessByAccount(login) {
    return await golos.api.getWitnessByAccountAsync(login)
}

async function getWitnessesByVote(login, limit) {
    return await golos.api.getWitnessesByVoteAsync(login,limit);
}

async function getWitnessSchedule() {
    return await golos.api.getWitnessScheduleAsync();
}

      module.exports.getEventsInBlock = getEventsInBlock;
module.exports.getBlockHeader = getBlockHeader;
module.exports.getTransaction = getTransaction;
module.exports.getConfig = getConfig;
module.exports.getProps = getProps;      
module.exports.updateAccount = updateAccount;
module.exports.getAccount = getAccount;
module.exports.getTicker = getTicker;
module.exports.getContent = getContent;
module.exports.publickPost = publickPost;
module.exports.sendPost = sendPost;
module.exports.getDelegations = getDelegations;
module.exports.lookupAccounts = lookupAccounts;
module.exports.getAccounts = getAccounts;
module.exports.getReputation = getReputation;
module.exports.send = send;
module.exports.wifToPublic = wifToPublic;
module.exports.donate = donate;
module.exports.randomGenerator = randomGenerator;
module.exports.getBalances = getBalances;
module.exports.getFeed = getFeed;
module.exports.getFollowingList = getFollowingList;
module.exports.vote = vote;
module.exports.getWitnessByAccount = getWitnessByAccount;
module.exports.getWitnessesByVote = getWitnessesByVote;
module.exports.getWitnessSchedule = getWitnessSchedule;