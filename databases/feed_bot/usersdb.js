const pool = require('./../@db.js')

async function getUser(id) {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_feed_bot");

        let collection = db.collection('users');

        let res = await collection.findOne({id});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function addUser(id, lng, prev_status, status, tags) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_feed_bot");

        let collection = db.collection('users');

        let res = await collection.insertOne({id, lng, prev_status, status, tags});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateUser(id, lng, prev_status, status, tags) {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos_feed_bot");

      let collection = db.collection('users');

      let res = await collection.updateOne({id}, {$set: {id, lng, prev_status, status, tags}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function findAllUsers() {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_feed_bot");

    let collection = db.collection('users');

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

module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.findAllUsers = findAllUsers;