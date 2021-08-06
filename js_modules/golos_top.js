const methods = require("./methods");
const udb = require("../databases/users-top/golos_usersdb");
const uiadb = require("../databases/users-top/uiadb");

async function run() {
try {
	let curr_acc = "";
	let gests = [];
	let users = await udb.getTop('golos');
	let k = 0;
try {
	while(1) {
		//if(k++ > 10) break;

		const accs = await methods.lookupAccounts(curr_acc);
		if (accs[0] === curr_acc) {
			accs.splice(0, 1);
		}
		if(accs.length == 0) {
			break;
		}

		const params = await methods.getProps();

		const {total_vesting_fund_steem, total_vesting_shares, current_supply, current_sbd_supply, accumulative_balance, total_reward_fund_steem} = params;
	
		const total_golos = parseFloat(total_vesting_fund_steem.split(" ")[0]);
		const total_vests = parseFloat(total_vesting_shares.split(" ")[0]);
	
		const vpg = total_vests / total_golos;
const all_golos = parseFloat(current_supply) - parseFloat(total_vesting_fund_steem) - parseFloat(accumulative_balance) - parseFloat(total_reward_fund_steem);

let uias = await methods.getBalances(accs);

for(let b of uias) {
for (let uia in b) {
	let data = b[uia];
	let summ_balance = parseFloat(data.balance) + parseFloat(data.tip_balance);
		await uiadb.updateTop(data.account, uia, summ_balance, parseFloat(data.balance), parseFloat(data.tip_balance));
}
								}
	
		let balances = await methods.getAccounts(accs);

		for(let b of balances) {
let reputation = await methods.getReputation(b.reputation);
reputation = parseFloat(reputation);
			await udb.updateTop(b.name, (parseFloat(b.vesting_shares.split(" ")[0]) / vpg), (parseFloat(b.vesting_shares.split(" ")[0]) / parseFloat(total_vests) * 100).toFixed(3), (parseFloat(b.delegated_vesting_shares.split(" ")[0]) / vpg), (parseFloat(b.received_vesting_shares.split(" ")[0]) / vpg), ((parseFloat(b.vesting_shares.split(" ")[0]) / vpg) - (parseFloat(b.delegated_vesting_shares.split(" ")[0]) / vpg) + (parseFloat(b.received_vesting_shares.split(" ")[0]) / vpg)), parseFloat(b.balance.split(" ")[0]), parseFloat(b.balance.split(" ")[0]) / parseFloat(all_golos) * 100, parseFloat(b.sbd_balance.split(" ")[0]), parseFloat(b.sbd_balance.split(" ")[0]) / parseFloat(current_sbd_supply) * 100, parseFloat(b.tip_balance.split(" ")[0]), reputation);
			curr_acc = b.name;
				}

			}
} catch (e) {
console.error(e);
process.exit(1);
}
} catch (e) {
	console.error(e);
}
}

module.exports.run = run;