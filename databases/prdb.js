const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getWitness(login) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-witnesses");

        let collection = db.collection('witnesses');

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

async function updateWitness(login, old_monthly_profit, now_monthly_profit, old_daily_profit, now_daily_profit, timestamp) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-witnesses");

      let collection = db.collection('witnesses');

      let res = await collection.updateOne({login}, {$set: {login, old_monthly_profit, now_monthly_profit, old_daily_profit, now_daily_profit, timestamp}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

      client.close();
  }
}

async function findAllWitnesses() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-witnesses");

      let collection = db.collection('witnesses');

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

module.exports.getWitness = getWitness;
module.exports.updateWitness = updateWitness;
module.exports.findAllWitnesses = findAllWitnesses;