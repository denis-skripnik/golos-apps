const botjs = require("./bot/bot");
const methods = require("../methods");
const i = require("./bot/interface");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");
const adb = require(process.cwd() + "/databases/golos_stakebot/accountsdb");
const bidsdb = require(process.cwd() + "/databases/golos_stakebot/bidsdb");
const bdb = require(process.cwd() + "/databases/blocksdb");
const helpers = require("../helpers");
const conf = require(process.cwd() + '/config.json');

var sjcl = require('sjcl');

Number.prototype.toFixedNoRounding = function(n) {
	const reg = new RegExp(`^-?\\d+(?:\\.\\d{0,${n}})?`, 'g')
	const a = this.toString().match(reg)[0];
	const dot = a.indexOf('.');
  
	if (dot === -1) {
	  return a + '.' + '0'.repeat(n);
	}
  
	const b = n - (a.length - dot) + 1;
  
	return b > 0 ? (a + '0'.repeat(b)) : a;
  }

async function run() {
let accounts = await adb.findAllAccounts();
let users = await udb.findAllUsers();
let telegram_users = {};
for (let user of users) {
	telegram_users[user.id] = user.referers;
}
if (accounts && accounts.length > 0) {
	var members = {};
	var referals = {};
	let lotery = []; // Массив аккаунтов для участия в лотерее.
	for (let user of accounts) {
		console.log('claim для пользователя ' + user.login)
				try {
			if (user.posting_key !== '') {
				let posting = sjcl.decrypt(user.login + '_postingKey_stakebot', user.posting_key);
				let get_account = await methods.getAccount(user.login);
				let acc = get_account[0];
		if (parseFloat(acc.vesting_shares) >= 50000000 && user.login !== conf.stakebot.golos_login) {
			lotery.push(user.login);
		}
				let temp_balance = acc.accumulative_balance;
if (parseFloat(temp_balance) >= 0.1) {
var float_claim = parseFloat(temp_balance);
var operations = [];
if (telegram_users[user.id] && telegram_users[user.id].length > 0) {
	let id = 2;
	for (let r in telegram_users[user.id]) {
		if (r === 1) {
			id = 1;
		}
		let referer = await adb.getAccountsByRefererCode(telegram_users[user.id][r]);
		if (referer && referer.length > 0) {
			if (referer[0].login === 'denis-skripnik') {
				referer[0].login = conf.stakebot.golos_login;
			}
			operations.push(["claim",{"from": user.login, "to": referer[0].login, "amount": (parseFloat(temp_balance) / 100 * id).toFixedNoRounding(3) + ' GOLOS', "to_vesting": referer[0].to_vesting_shares}]);
			float_claim -= (parseFloat(temp_balance) / 100 * id);
			if (!referals[referer[0].id]) {
			referals[referer[0].id] = '';
			referals[referer[0].id] += `${user.login}: ${(parseFloat(temp_balance) / 100 * id).toFixedNoRounding(3)} GOLOS
`;
		} else {
			referals[referer[0].id] += `${user.login}: ${(parseFloat(temp_balance) / 100 * id).toFixedNoRounding(3)} GOLOS
`;
}
}
	}
}
float_claim = float_claim.toFixedNoRounding(3);
console.log('Сумма пользователя: ' + parseFloat(float_claim));
operations.push(["claim",{"from": user.login, "to": user.login, "amount": parseFloat(float_claim).toFixedNoRounding(3) + ' GOLOS', "to_vesting": user.to_vesting_shares}]);
console.log('Операции: ' + JSON.stringify(operations));
try {
await methods.send(operations, posting);
if (!members[user.id]) {
	members[user.id] = '';
	members[user.id] += `${user.login}: ${float_claim}
`;
} else {
	members[user.id] += `${user.login}: ${float_claim}
`;
}
} catch(error) {
	console.error('Ошибка отправки: ' + JSON.stringify(error));
}
await helpers.sleep(1000);
} else {
	console.log(temp_balance);
}
} else {
	console.log('Постинг ключ пустой.');
}
} catch(e) {
	console.error('claining error: ' + e);
		continue;
	}
}
await i.sendClaimNotify(members, referals);
await helpers.sleep(1000);
// Выбор победителя лотереи.
const get_block = await bdb.getBlock(1);
const end_block = get_block.last_block;
const start_block = end_block - 1;
let winner = await methods.randomGenerator(start_block, end_block, lotery.length);
await methods.donate(conf.stakebot.golos_posting_key, conf.stakebot.golos_login, lotery[winner], '20.000 GOLOS', `Поздравляем! Вы выиграли в лотерее https://t.me/golos_stake_bot для пользователей от 50000000 GESTS (примерно 18000 СГ). Пользуйтесь ботом, привлекайте друзей и участвуйте в лотерее! Участников: ${lotery.length}, доказательство: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${lotery.length}. Congratulations! You won the lottery https://t.me/golos_stake_bot for users from 50000000 GESTS (approximately 18000 GP). Use the bot, attract friends and participate in the lottery! Participants: ${lotery.length}, proof: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${lotery.length}`);
}
}

async function selectBid() {
	let bids = await bidsdb.findAllBids();
if (bids && bids.length > 0) {
try {
	const get_block = await bdb.getBlock(1);
	const end_block = get_block.last_block;
	const start_block = end_block - 1;
	let winner = await methods.randomGenerator(start_block, end_block, bids.length);
	console.log('Победитель: ' + winner);
	let amount = bids.reduce(function(p,c){return p+c.amount;},0);
	amount = amount.toFixed(3) + ' GOLOS';
	await methods.donate(conf.stakebot.golos_posting_key, conf.stakebot.golos_login, bids[winner].user, amount, `Поздравляем! Вы выиграли в ставках https://t.me/golos_stake_bot. Пользуйтесь ботом, привлекайте друзей и делайте ставки! Участников: ${bids.length}, доказательство: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${bids.length}. Congratulations! You won in the bets https://t.me/golos_stake_bot. Use a bot, get your friends and place your bets! Participants: ${bids.length}, the proof: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${bids.length}`);
let members = [];
	for (let n in bids) {
		if (parseInt(n) === parseInt(winner)) {
	members.push({login: bids[n].user, status: true});
} else {
	members.push({login: bids[n].user, status: false});
}
}
	let proof = `Доказательство: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${bids.length}. The proof: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${bids.length}`;
await i.sendBidsNotify(members, proof, parseInt(winner)+1);
await helpers.sleep(1000);
await bidsdb.removeBids();
} catch(e) {
	console.log('Ошибка в ставках: ' + e);
}
		}
	}

botjs.allCommands();

module.exports.run = run;
module.exports.selectBid = selectBid;