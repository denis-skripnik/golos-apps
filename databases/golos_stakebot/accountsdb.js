const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

let client = null

MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(function(instance){
	client = instance
}).catch(console.log);

async function getAccounts(id) {

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		const res = [];
		let cursor = await collection.find({
			id
		}).limit(500);
		let doc = null;
		while (null != (doc = await cursor.next())) {
			res.push(doc);
		}
		return res;
	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function getAccountsByRefererCode(referer_code) {

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		const res = [];
		let cursor = await collection.find({
			referer_code
		}).limit(500);
		let doc = null;
		while (null != (doc = await cursor.next())) {
			res.push(doc);
		}
		return res;
	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function getAccount(login) {


	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		let res = await collection.findOne({
			login
		});

		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function updateAccount(id, referer_code, login, posting_key, to_vesting_shares) {


	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		let res = await collection.updateOne({
			login
		}, {
			$set: {
				id,
				referer_code,
				login,
				posting_key,
				to_vesting_shares
			}
		}, {
			upsert: true
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function removeAccount(id, login) {


	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		let res = await collection.deleteOne({
			id,
			login
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function findAllAccounts() {

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('accounts');

		const res = [];
		let cursor = await collection.find({}).limit(500);
		let doc = null;
		while (null != (doc = await cursor.next())) {
			res.push(doc);
		}
		return res;
	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

module.exports.getAccounts = getAccounts;
module.exports.getAccountsByRefererCode = getAccountsByRefererCode;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.removeAccount = removeAccount;
module.exports.findAllAccounts = findAllAccounts;