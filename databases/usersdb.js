const pool = require('./@db.js')

async function getUser(login, prefix) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('users' + prefix);

        let query = {login}

        let res = await collection.findOne(query);
console.log(JSON.stringify(res));
return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function updateUser(login, golos_amount, gbg_amount, prefix) {


  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);

      let res = await collection.updateOne({login}, {$set: {login, golos_amount, gbg_amount}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function removeUsers(prefix) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);

      let res = await collection.drop();

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function findAllUsers(prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('users' + prefix);

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
module.exports.updateUser = updateUser;
module.exports.removeUsers = removeUsers;
module.exports.findAllUsers = findAllUsers;