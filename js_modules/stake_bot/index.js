const botjs = require("./bot/bot");
const methods = require("../methods");
const i = require("./bot/interface");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");
const adb = require(process.cwd() + "/databases/golos_stakebot/accountsdb");
const helpers = require("../helpers");
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
	for (let user of accounts) {
		console.log('claim для пользователя ' + user.login)
		try {
			if (user.posting_key !== '') {
				let posting = sjcl.decrypt(user.login + '_postingKey_stakebot', user.posting_key);
				let get_account = await methods.getAccount(user.login);
				let acc = get_account[0];
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
}
}

botjs.allCommands();

module.exports.run = run;