var conf = require('../config.json');
var golos = require('golos-classic-js');
golos.config.set('websocket',conf.node);
let keccak = require("keccak");
let BigI = require("big-integer");
const { start } = require('repl');

async function getOpsInBlock(bn) {
    return await golos.api.getOpsInBlockAsync(bn, false);
  }

  async function getBlockHeader(block_num) {
  return await golos.api.getBlockHeaderAsync(block_num);
  }

  async function getTransaction(trxId) {
    return await golos.api.getTransactionAsync(trxId);
    }
  
  async function getProps() {
      return await golos.api.getDynamicGlobalPropertiesAsync();
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
let post = await golos.api.getContentAsync(author, permlink, 0);
if (post.parent_author === '') {
return {code: 1, title: post.title, created: post.created};
} else {
    return {code: 2, title: post.title, created: post.created};
}
} catch(e) {
return {code: -1, error: e};
}
}

async function publickPost(title, permlink, main_data, answers, end_date) {
    let wif = conf.posting_key;
    let parentAuthor = conf.login;
    let parentPermlink = 'votes-list';
    let author = conf.login;
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
    return golos.formatter.reputation(reputation);
}

async function send(operations, posting) {
    return await golos.broadcast.sendAsync({extensions: [], operations}, [posting]);
}

async function wifToPublic(key) {
    return golos.auth.wifToPublic(key);
}

async function donate(posting_key, account, donate_to, donate_amount, donate_memo) {
    return golos.broadcast.donateAsync(posting_key, account, donate_to, donate_amount, {app: 'golos-stake-bot', version: 1, comment: donate_memo, target: {type: 'personal_donate'}}, []);
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
    random = parseInt(random);
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

      module.exports.getOpsInBlock = getOpsInBlock;
module.exports.getBlockHeader = getBlockHeader;
module.exports.getTransaction = getTransaction;
module.exports.getProps = getProps;      
module.exports.updateAccount = updateAccount;
module.exports.getAccount = getAccount;
module.exports.getTicker = getTicker;
module.exports.getContent = getContent;
module.exports.publickPost = publickPost;
module.exports.getDelegations = getDelegations;
module.exports.lookupAccounts = lookupAccounts;
module.exports.getAccounts = getAccounts;
module.exports.getReputation = getReputation;
module.exports.send = send;
module.exports.wifToPublic = wifToPublic;
module.exports.donate = donate;
module.exports.randomGenerator = randomGenerator;
module.exports.getBalances = getBalances;