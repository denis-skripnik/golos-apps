const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getUser(login, prefix) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

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

        client.close();
    }
}

async function updateUser(login, golos_amount, gbg_amount, prefix) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

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

      client.close();
  }
}

async function removeUsers(prefix) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

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

      client.close();
  }
}

async function findAllUsers(prefix) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

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

      client.close();
  }
}

module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.removeUsers = removeUsers;
module.exports.findAllUsers = findAllUsers;