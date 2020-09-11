const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

let client = null

MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(function(instance){
	client = instance
}).catch(console.log);

async function getWitness(login) {


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


    }
}

async function updateWitness(login, old_monthly_profit, now_monthly_profit, old_daily_profit, now_daily_profit, timestamp) {


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

  }
}

async function findAllWitnesses() {


  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-witnesses");

      let collection = db.collection('witnesses');

      const res = [];
      let cursor = await collection.find({}).sort({now_daily_profit: -1}).limit(500);
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

module.exports.getWitness = getWitness;
module.exports.updateWitness = updateWitness;
module.exports.findAllWitnesses = findAllWitnesses;