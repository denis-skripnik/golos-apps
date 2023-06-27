require('./databases/@db.js').initialize({
    url: 'mongodb://localhost:27017',
    poolSize: 15
})

require("./js_modules/ajax");
const CronJob = require('cron').CronJob;
const conf = require("./config.json");
const d = require("./js_modules/donators");
const refs = require("./js_modules/referrers");
const top = require("./js_modules/golos_top");
const votes = require("./js_modules/votes");
const stakebot = require("./js_modules/stake_bot");
const watchdog = require("./js_modules/watchdog");
const as = require("./js_modules/activity_stats");
const wr = require("./js_modules/witness_rewards");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const asdb = require("./databases/asdb");
const gsbpdb = require("./databases/golos_stakebot/postsdb");
const bdb = require("./databases/blocksdb");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

async function processBlock(bn, props) {
    const block = await methods.getEventsInBlock(bn);
    let ok_ops_count = 0;
    let posts = {};
    for(let tr of block) {
        const [op, opbody] = tr.op;
        switch(op) {
            case "donate":    
if (opbody.to !== 'ecurrex-t2g' && opbody.to !== 'tiptok') {
    ok_ops_count += await d.donateOperation(op, opbody);
}
            break;
            case "transfer":
            ok_ops_count += await d.transferOperation(op, opbody);
            ok_ops_count += await votes.transferOperation(tr.timestamp, op, opbody);
            break;
            case "account_create_with_delegation":
            ok_ops_count += await refs.accountCreateWithDelegationOperation(op, opbody);
            break;
            case "account_create_with_invite":
            ok_ops_count += await refs.accountCreateWithInviteOperation(op, opbody);
            break;
            case "custom_json":
            ok_ops_count += await votes.customJsonOperation(op, opbody);
            break;
            case "comment":
                if (!posts[`${opbody.author}/${opbody.permlink}`]) {
                    posts[`${opbody.author}/${opbody.permlink}`] = await methods.getContent(opbody.author, opbody.permlink)
                }
            ok_ops_count += await as.commentOperation(posts[`${opbody.author}/${opbody.permlink}`], op, opbody, tr.timestamp);
            ok_ops_count += await stakebot.commentOperation(posts[`${opbody.author}/${opbody.permlink}`], opbody, tr.timestamp);
            break;
            case "vote":
            ok_ops_count += await as.voteOperation(op, opbody, tr.timestamp);
            if (opbody.permlink !== '') {
                if (!posts[`${opbody.author}/${opbody.permlink}`]) {
                    posts[`${opbody.author}/${opbody.permlink}`] = await methods.getContent(opbody.author, opbody.permlink)
                }
                ok_ops_count += await stakebot.voteOperation(posts[`${opbody.author}/${opbody.permlink}`], opbody);
            }
            break;
case "producer_reward":
ok_ops_count += await wr.producerRewardOperation(opbody, props.total_vesting_fund_steem, props.total_vesting_shares, tr.timestamp);
break;
            default:
                    //неизвестная команда
            }
        }
        return ok_ops_count;
    }

let PROPS = null;

let bn = 0;
let last_bn = 0;
let delay = SHORT_DELAY;

async function getNullTransfers() {
    await watchdog.runBot();
    PROPS = await methods.getProps();
            const block_n = await bdb.getBlock(PROPS.last_irreversible_block_num);
bn = block_n.last_block;

delay = SHORT_DELAY;
while (true) {
    try {
        if (bn > PROPS.last_irreversible_block_num) {
            // console.log("wait for next blocks" + delay / 1000);
            await helpers.sleep(delay);
            await watchdog.getWitnessesByBlock();
            PROPS = await methods.getProps();
        } else {
            if(0 < await processBlock(bn, PROPS)) {
                delay = SHORT_DELAY;
            } else {
                delay = LONG_DELAY;
            }
            bn++;
            await bdb.updateBlock(bn);
        }
    } catch (e) {
        console.log("error in work loop", e);
        await helpers.sleep(1000);
        }
    }
}

setInterval(() => {
    if(last_bn == bn) {

        try {
            console.log('Global test1');
                process.exit(1);
        } catch(e) {
            console.log('Global test2');
            process.exit(1);
        }
    }
    last_bn = bn;
}, SUPER_LONG_DELAY);

setTimeout(getNullTransfers, 3000);

new CronJob('0 30 * * * *', top.run, null, true);

new CronJob('0 59 23 * * *', stakebot.sendStat, null, true);
new CronJob('0 0 18 * * *', stakebot.selectBid, null, true);
new CronJob('0 0 3 1 * *', stakebot.selectJackpotWinner, null, true);

new CronJob('0 0 0 * * *', asdb.removeactivityStats, null, true);    
new CronJob('0 0 0 * * 0', gsbpdb.removePosts, null, true);    
new CronJob('0 0 3 * * *', wr.producersDay, null, true);    
new CronJob('0 0 3 1 * *', wr.producersMonth, null, true);

methods.updateAccount('votes');


const cleanup = require("./databases/@db.js").cleanup;
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);