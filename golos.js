require("./js_modules/ajax");
const CronJob = require('cron').CronJob;
const conf = require("./config.json");
const d = require("./js_modules/donators");
const refs = require("./js_modules/referrers");
const top = require("./js_modules/golos_top");
const votes = require("./js_modules/votes");
const stakebot = require("./js_modules/stake_bot");
const as = require("./js_modules/activity_stats");
const wr = require("./js_modules/witness_rewards");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const asdb = require("./databases/asdb");
const bdb = require("./databases/blocksdb");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

async function processBlock(bn, props) {
    const block = await methods.getOpsInBlock(bn);
let ok_ops_count = 0;
    for(let tr of block) {
        const [op, opbody] = tr.op;
        switch(op) {
            case "donate":    
            ok_ops_count += await d.donateOperation(op, opbody);
            break;
            case "transfer":
            ok_ops_count += await d.transferOperation(op, opbody);
            ok_ops_count += await votes.transferOperation(op, opbody);
            break;
            case "account_create_with_delegation":
            ok_ops_count += await refs.accountCreateWithDelegationOperation(op, opbody);
            break;
            case "custom_json":
            ok_ops_count += await votes.customJsonOperation(op, opbody);
            break;
            case "comment":
            ok_ops_count += await as.commentOperation(op, opbody, tr.timestamp);
            break;
            case "vote":
            ok_ops_count += await as.voteOperation(op, opbody);
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
    PROPS = await methods.getProps();
            const block_n = await bdb.getBlock(PROPS.last_irreversible_block_num);
bn = block_n.last_block;

delay = SHORT_DELAY;
while (true) {
    try {
        if (bn > PROPS.last_irreversible_block_num) {
            // console.log("wait for next blocks" + delay / 1000);
            await helpers.sleep(delay);
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
        console.log("error in work loop" + e);
        await helpers.sleep(1000);
        }
    }
}

setInterval(() => {
    if(last_bn == bn) {

        try {
                process.exit(1);
        } catch(e) {
            process.exit(1);
        }
    }
    last_bn = bn;
}, SUPER_LONG_DELAY);

getNullTransfers()

new CronJob('0 30 * * * *', top.run, null, true);
new CronJob('0 0 0 * * *', stakebot.run, null, true);
new CronJob('0 0 12 * * *', stakebot.run, null, true);    
new CronJob('0 0 0 * * *', asdb.removeactivityStats, null, true);    

methods.updateAccount('votes');