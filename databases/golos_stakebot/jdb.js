const pool = require('./../@db.js')

async function getJackpotUser(user) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('jackpot');

		let res = await collection.findOne({
			user
		});

		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function updateJackpot(user, amount) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('jackpot');
        
                let res = await collection.updateOne({user}, {$set: {user, amount}}, {upsert: true});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function removeJackpot() {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('jackpot');
    
        let res = await collection.drop();

        return res;

    } catch (err) {

        console.log(err);
        return err;
    } finally {

    }
}

async function getJackpot() {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('jackpot');

    const res = [];
    let cursor = await collection.find({}).limit(500);
    let doc = null;
    while(null != (doc = await cursor.next())) {
        res.push(doc);
    }
return res;
  } catch (err) {

    console.log(err);
return err;
  } finally {
}
}

module.exports.getJackpotUser = getJackpotUser;
module.exports.updateJackpot = updateJackpot;
module.exports.removeJackpot = removeJackpot;
module.exports.getJackpot = getJackpot;