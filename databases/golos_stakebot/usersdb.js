const pool = require('./../@db.js')

async function getUser(id) {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.findOne({id});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function getUserByRefererCode(referer_code) {

    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.findOne({referer_code});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function addUser(id, referers, lng, prev_status, status, referer_code, tags) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.insertOne({id, referers, lng, prev_status, status, referer_code, tags, keywords: "", exclude_authors: ""});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateUser(id, referers, lng, prev_status, status, referer_code, tags, keywords, exclude_authors) {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos_stakebot");

      let collection = db.collection('users');

      let res = await collection.updateOne({id}, {$set: {id, referers, lng, prev_status, status, referer_code, tags, keywords, exclude_authors}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function removeUser(id) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('users');

		let res = await collection.deleteOne({
			id
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function findAllUsers(isObject = false) {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('users');

    let cursor = await collection.find({}).limit(500);
    let doc = null;
if (isObject == false) {
    const res = [];
    while(null != (doc = await cursor.next())) {
        res.push(doc);
    }
return res;
} else {
    const res = {};
    while(null != (doc = await cursor.next())) {
        res[doc.id] = doc;
    }
return res;
}
  } catch (err) {

    console.log(err);
return err;
  } finally {
}
}

module.exports.getUser = getUser;
module.exports.getUserByRefererCode = getUserByRefererCode;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.findAllUsers = findAllUsers;