const fs = require("fs");
const botjs = require("./bot/bot");
const methods = require("../methods");
const i = require("./bot/interface");
const udb = require(process.cwd() + "/databases/golos_stakebot/usersdb");
const adb = require(process.cwd() + "/databases/golos_stakebot/accountsdb");
const bidsdb = require(process.cwd() + "/databases/golos_stakebot/bidsdb");
const jdb = require(process.cwd() + "/databases/golos_stakebot/jdb");
const pdb = require(process.cwd() + "/databases/golos_stakebot/postsdb");
const bdb = require(process.cwd() + "/databases/blocksdb");
const sdb = require(process.cwd() + "/databases/golos_stakebot/statdb");
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



async function voteOperation(content, opbody) {
	let ok_ops_count = 0;
if (!content || content && content.code !== 1 || content && content.ended === true) {
return ok_ops_count;
}
let accounts = await adb.findAllAccounts();
	await sdb.updateStat({accounts_count: accounts.length});
if (accounts && accounts.length > 0) {
		var members = {};
		let config_mass = await methods.getConfig();
		let props = await methods.getProps();

		for (let acc of accounts) {
			try {
				if (acc.posting_key !== '' && acc.curators && acc.curators !== '') {
					let posting = sjcl.decrypt(acc.login + '_postingKey_stakebot', acc.posting_key);
					if (acc.exclude_authors && acc.exclude_authors.indexOf(opbody.author) > -1) {
						continue;
					}
					let get_account = await methods.getAccount(acc.login);
					let account = get_account[0];
					let last_vote_time = account.last_vote_time;
						let current_time = new Date(props.time).getTime();
						let last_vote_seconds = new Date(last_vote_time).getTime();
						let fastpower = 10000 / config_mass.STEEMIT_VOTE_REGENERATION_SECONDS;
						 let volume_not = (account.voting_power + ((current_time-last_vote_seconds)/1000)* fastpower)/100; //расчет текущей Voting Power
						volume = volume_not.toFixed(2); // Округление до двух знаков после запятой
						 let charge = 0;
						if (volume>=100) {
						charge = 100;
						}
						else {
							charge=volume;
						}
						if (acc.min_energy && charge >= acc.min_energy || !acc.min_energy && charge === 100) {
							let curators = acc.curators.split(',');
							let votes = content.votes;
													if (curators && curators.length > 0 && curators.indexOf(opbody.voter) > -1 && content.votes && votes.indexOf(acc.login) === -1) {
														var operations = [];
	let weight = opbody.weight;
	if (weight > 0) {
		if (acc.curators_mode && acc.curators_mode !== 'replay') {
			weight = 10000;
		}
		operations.push(["vote",{"voter": acc.login, "author": opbody.author, "permlink": opbody.permlink, "weight": weight}]);
		try {
console.log('test4');
			await methods.send(operations, posting);
		if (!members[acc.id]) {
		members[acc.id] = {};
		members[acc.id]['unvote_data'] = `${acc.login}_${content.id}`;
		members[acc.id]['text'] = `🔁 <a href="https://dpos.space/golos/profiles/${opbody.voter}/votes">${opbody.voter}</a>
	${acc.login} ➡ <a href="https://golos.id/@${opbody.author}/${opbody.permlink}">@${opbody.author}/${content.title}</a>  ${weight / 100}%.
	`;
		} else {
			members[acc.id] = {};
			members[acc.id]['unvote_data'] = `${acc.login}_${content.id}`;
			members[acc.id]['text'] = `🔁 <a href="https://dpos.space/golos/profiles/${opbody.voter}/votes">${opbody.voter}</a>
		${acc.login} ➡ <a href="https://golos.id/@${opbody.author}/${opbody.permlink}">@${opbody.author}/${content.title}</a>  ${weight / 100}%.
		`;
	}
	let day = new Date().getDate();
	await pdb.updatePost(content.id, opbody.author, opbody.permlink, day);
} catch(error) {
		console.error('send vote', error);
		continue;	
	}
	
	}
	
}
await helpers.sleep(1000);
}
	}
	} catch(e) {
		console.error(e);
			continue;
		}
	}
	if (Object.keys(members).length > 0) {
		await i.sendReplayVoteNotify(members);
		ok_ops_count += 1;
	}
}
return ok_ops_count;
}

	async function commentOperation(content, opbody, timestamp) {
		let ok_ops_count = 0
		if (!content || content && content.code !== 1 || content && content.code !== 1 && content.edit !== false || content && content.code === 1 && content.edit !== false || content && content.ended === true) {
		return ok_ops_count;
		}
		let sended_users = {};
		let accounts = await adb.findAllAccounts();
		await sdb.updateStat({accounts_count: accounts.length});
		if (accounts && accounts.length > 0) {
			var members = {};
			let config_mass = await methods.getConfig();
			let props = await methods.getProps();

			for (let acc of accounts) {
						try {
					if (acc.posting_key !== '' && acc.favorits && acc.favorits !== '') {
						let posting = sjcl.decrypt(acc.login + '_postingKey_stakebot', acc.posting_key);
						let get_account = await methods.getAccount(acc.login);
						let account = get_account[0];
						let last_vote_time = account.last_vote_time;
							let current_time = new Date(props.time).getTime();
							let last_vote_seconds = new Date(last_vote_time).getTime();
							let fastpower = 10000 / config_mass.STEEMIT_VOTE_REGENERATION_SECONDS;
							 let volume_not = (account.voting_power + ((current_time-last_vote_seconds)/1000)* fastpower)/100; //расчет текущей Voting Power
							volume = volume_not.toFixed(2); // Округление до двух знаков после запятой
							 let charge = 0;
							if (volume>=100) {
							charge = 100;
							}
							else {
								charge=volume;
							}
							if (acc.min_energy && charge >= acc.min_energy || !acc.min_energy && charge === 100) {
		let favorits = acc.favorits.split(',');
	let content = await methods.getContent(opbody.author, opbody.permlink)
	let favorite_number = favorits.findIndex(el => el.split(':').indexOf(opbody.author) > -1);
	if (favorite_number > -1) {
		var operations = [];
		let weight = (acc.favorits_percent ? acc.favorits_percent : 1) * 100;
		let favorite_percent = favorits[favorite_number].split(':')[1];
		if (favorite_percent) weight = parseInt(parseFloat(favorite_percent) * 100);
		operations.push(["vote",{"voter": acc.login, "author": opbody.author, "permlink": opbody.permlink, "weight": weight}]);
		try {
			await methods.send(operations, posting);
		if (!members[acc.id]) {
			members[acc.id] = {};
			members[acc.id]['unvote_data'] = `${acc.login}_${content.id}`;
			members[acc.id]['text'] = `💕 ${acc.login} ➡ <a href="https://golos.id/@${opbody.author}/${opbody.permlink}">@${opbody.author}/${content.title}</a>  ${weight / 100}%.
		`;
		} else {
			members[acc.id] = {};
			members[acc.id]['unvote_data'] = `${acc.login}_${content.id}`;
			members[acc.id]['text'] = `💕 ${acc.login} ➡ <a href="https://golos.id/@${opbody.author}/${opbody.permlink}">@${opbody.author}/${content.title}</a>  ${weight / 100}%.
		`;
	}
	let day = new Date().getDate();
	await pdb.updatePost(content.id, opbody.author, opbody.permlink, day);
	sended_users[acc.id] = true;
	ok_ops_count += 1;
} catch(error) {
		console.error(error);
continue;
	}
		
	}
		await helpers.sleep(1000);
	}
		}
		} catch(e) {
			console.error('claining error: ' + e);
				continue;
			}
		}
		if (Object.keys(members).length > 0) {
			await i.sendFavoritsVoteNotify(members);
		}
		}
		await i.runScanner(content, opbody, timestamp, sended_users);
		return ok_ops_count;
	}

async function selectBid() {
	let bids = await bidsdb.findAllBids();
if (bids && bids.length > 1) {
try {
	const get_block = await methods.getProps();
	const end_block = get_block.head_block_number;
	const start_block = end_block - 1;
	let winner = await methods.randomGenerator(start_block, end_block, bids.length);
	console.log('Победитель: ' + winner);
	let amount = bids.reduce(function(p,c){return p+c.amount;},0);
	let fee = (amount - bids[winner].amount) * 0.1;
if (fee > 0.002) amount -= fee;
	await sdb.updateStat({bids_amount: amount});
amount = amount.toFixed(3) + ' GOLOS';
			await methods.donate(conf.stakebot.golos_posting_key, conf.stakebot.golos_login, bids[winner].user, amount, `Поздравляем! Вы выиграли в ставках https://t.me/golos_stake_bot. Пользуйтесь ботом, привлекайте друзей и делайте ставки! Участников: ${bids.length}, доказательство: https://dpos.space/golos/randomblockchain/?block1=${start_block}&block2=${end_block}&participants=${bids.length}. Congratulations! You won in the bets https://t.me/golos_stake_bot. Use a bot, get your friends and place your bets! Participants: ${bids.length}, the proof: https://dpos.space/golos/randomblockchain/?block1=${start_block}&block2=${end_block}&participants=${bids.length}`);

			if (fee >= 0.002) {
	let ju = await jdb.getJackpotUser(bids[winner].user);
	let jamount = fee * 0.5;
	jamount = jamount.toFixed(3);
	jamount = parseFloat(jamount);
	if (ju) {
	jamount += ju.amount;
	}
	await jdb.updateJackpot(bids[winner].user, jamount);
	}

			let members = [];
	for (let n in bids) {
		if (parseInt(n) === parseInt(winner)) {
	members.push({login: bids[n].user, status: true});
} else {
	members.push({login: bids[n].user, status: false});
}
}
	let proof = `https://dpos.space/golos/randomblockchain/?block1=${start_block}&block2=${end_block}&participants=${bids.length}`;
await i.sendBidsNotify(members, proof, parseInt(winner)+1);
await helpers.sleep(1000);
await bidsdb.removeBids();
} catch(e) {
	console.log('Ошибка в ставках: ' + e);
}

}
let j = await jdb.getJackpot();
if (j && j.length > 0) {
	let amount = j.reduce(function(p,c){return p+c.amount;},0);
await sdb.updateStat({jackpot_amount, amount})
}
}

async function selectJackpotWinner() {
	let j = await jdb.getJackpot();
if (j && j.length > 0) {
try {
	const get_block = await methods.getProps();
	const end_block = get_block.head_block_number;
	const start_block = end_block - 1;
	let winner = await methods.randomGenerator(start_block, end_block, j.length);
	console.log('Победитель: ' + winner);
	let amount = j.reduce(function(p,c){return p+c.amount;},0);
	amount = amount.toFixed(3) + ' GOLOS';
	await methods.donate(conf.stakebot.golos_posting_key, conf.stakebot.golos_login, j[winner].user, amount, `Поздравляем! Вы получили джекпот https://t.me/golos_stake_bot! Пользуйтесь ботом, привлекайте друзей и делайте ставки, чтоб получить шанс выиграть джекпот. Участников: ${j.length}, доказательство: https://dpos.space/golos/randomblockchain/?block1=${start_block}&block2=${end_block}&participants=${j.length}. Congratulations! You got the jackpot https://t.me/golos_stake_bot! Use the bot, attract friends and place bets to get a chance to win the jackpot. Participants: ${j.length}, the proof: https://dpos.space/golos/randomblockchain/?block1=${end_block}&block2=${start_block}&participants=${j.length}`);
let members = [];
	for (let n in j) {
		if (parseInt(n) === parseInt(winner)) {
	members.push({login: j[n].user, status: true});
} else {
	members.push({login: j[n].user, status: false});
}
}
	let proof = `https://dpos.space/golos/randomblockchain/?block1=${start_block}&block2=${end_block}&participants=${j.length}`;
await i.sendJackpotNotify(members, proof, parseInt(winner)+1);
await helpers.sleep(1000);
await jdb.removeJackpot();
} catch(e) {
	console.log('Ошибка в ставках: ' + e);
}
		}
	}

// Публикация поста со статистикой:
async function sendStat() {
let text = `Напоминаем, что https://t.me/golos_stake_bot - это бот, получающий claim за вас, а также автоматически курирующий посты.
Ниже будет статистика работы за последние сутки.
`;
let stat = await sdb.getStat();
if (stat && Object.keys(stat).length > 0) {
	text += `- Пользователей Голоса, получающих Claim: ${stat.accounts_count},
- Сумма всех ставок: ${stat.bids_amount},
- Джекпот на данный момент равен ${stat.jackpot_amount} GOLOS.

## Посты, которые проапаны были ботом сегодня
`;
let day = new Date().getDate();
let posts = await pdb.getPostsByDay(day);
if (posts && posts.length > 0) {
	for (let post of posts) {
		text += `- <a href="https://golos.id/@${post.author}/${post.permlink}">@${post.author}/${post.permlink}</a>
`;
	}
}
await methods.sendPost(conf.stakebot.golos_posting_key, conf.stakebot.golos_login, 'Статистика работы Golos Stake bot','ru--statistika', 'stat' + new Date().getTime(), text);
await sdb.updateStat({accounts_count: 0, bids_amount: 0, jackpot_amount: 0})
}
}

botjs.allCommands();

module.exports.voteOperation = voteOperation;
module.exports.commentOperation = commentOperation;
module.exports.selectBid = selectBid;
module.exports.selectJackpotWinner = selectJackpotWinner;
module.exports.sendStat = sendStat;