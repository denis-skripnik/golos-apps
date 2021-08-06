const pool = require('../@db.js')

async function getUser(login, token, prefix) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('users' + prefix);

        let query = {login, token}

        let res = await collection.findOne(query);
return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {


    }
}

async function updateUser(login, token, amount, prefix) {


  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);

      let res = await collection.updateOne({login, token}, {$set: {login, token, amount}}, { upsert: true });
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function removeUsers(_id, prefix) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);

      let res = await collection.deleteOne({_id});

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function findAllUsers(token, prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);
let query = {};
if (token !== '') {
    query = {token};
}
const res = [];
      let cursor = await collection.find(query).limit(500);
      let doc = null;
      while(null != (doc = await cursor.next())) {
          res.push(doc);
      }
  return res;
    } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.removeUsers = removeUsers;
module.exports.findAllUsers = findAllUsers;