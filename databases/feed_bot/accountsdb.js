const pool = require('./../@db.js')

async function getAccounts(id) {
	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_feed_bot");

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

async function getAccount(login) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_feed_bot");

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

async function updateAccount(id, login, lng, last_post, show_reblogs) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_feed_bot");

		let collection = db.collection('accounts');

		let res = await collection.updateOne({
			login
		}, {
			$set: {
				id,
				login,
				lng,
				last_post,
				show_reblogs
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

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_feed_bot");

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
	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_feed_bot");

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
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.removeAccount = removeAccount;
module.exports.findAllAccounts = findAllAccounts;