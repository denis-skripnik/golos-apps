const pool = require('../@db.js')

async function getToken(token) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('tokens');

        let query = {token}

        let res = await collection.findOne(query);
console.log(JSON.stringify(res));
return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function updateTokens(token) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('tokens');

      let res = await collection.updateOne({token}, {$set: {token}}, { upsert: true });

      return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function findAllTokens() {
  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('tokens');
      
        const res = [];
      let cursor = await collection.find({}).limit(500);
      let doc = null;
      while(null != (doc = await cursor.next())) {
          res.push(doc.token);
      }
      return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

module.exports.getToken = getToken;
module.exports.updateTokens = updateTokens;
module.exports.findAllTokens = findAllTokens;