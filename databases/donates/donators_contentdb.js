const pool = require('../@db.js')

async function getDonatorsOneContent(token, login, author, permlink, prefix) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('donators_content' + prefix);

        let query = {token, login, author, permlink}

        let res = await collection.findOne(query);
console.log(JSON.stringify(res));
return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function updateDonatorsOneContent(token, login, author, permlink, amount, prefix) {


  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('donators_content' + prefix);

      let res = await collection.updateOne({token, login, author, permlink}, {$set: {token, login, author, permlink, amount}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function findAllDonatorContent(login, token, prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('donators_content' + prefix);

      const res = [];
      let cursor = await collection.find({login, token}).limit(500);
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

module.exports.getDonatorsOneContent = getDonatorsOneContent;
module.exports.updateDonatorsOneContent = updateDonatorsOneContent;
module.exports.findAllDonatorContent = findAllDonatorContent;