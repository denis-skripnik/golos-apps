const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getUser(login) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('activityStats');

        let query = {login}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {

        client.close();
    }
}

async function updateUser(login, content, flags, upvotes, all_flags_weight, all_upvotes_weight) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("blockchains");

      let collection = db.collection('activityStats');

      let res = await collection.updateOne({login}, {$set: {login, content, flags, upvotes, all_flags_weight, all_upvotes_weight}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

      client.close();
  }
}

async function removeactivityStats() {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("blockchains");

      let collection = db.collection('activityStats');

      let res = await collection.drop();

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

      client.close();
  }
}

async function findAllActivityStats() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("blockchains");

      let collection = db.collection('activityStats');

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
module.exports.removeactivityStats = removeactivityStats;
module.exports.findAllActivityStats = findAllActivityStats;