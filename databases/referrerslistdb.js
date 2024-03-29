const pool = require('./@db.js')

async function getReferrer(login) {


  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('referrers_list');

        let query = {login}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {


    }
}

async function updateReferrer(login, referals) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('referrers_list');

      let res = await collection.updateOne({login}, {$set: {login, referals}}, { upsert: true });
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function findAllReferrers() {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('referrers_list');

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

module.exports.getReferrer = getReferrer;
module.exports.updateReferrer = updateReferrer;
module.exports.findAllReferrers = findAllReferrers;