const pool = require('./@db.js')

async function getVote(_id) {

  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-votes");

        let collection = db.collection('votes');

        let query = {_id}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {


    }
}

async function getVoteByPermlink(permlink) {
  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-votes");

        let collection = db.collection('votes');

        let query = {permlink}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {

    }
}

async function addVote(question, answers, permlink, consider, end_date) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-votes");

      let collection = db.collection('votes');

      let res = await collection.insertOne({question, answers, permlink, consider, end_date});

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function removeVote(db_id) {
  let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos-votes");

    let collection = db.collection('votes');

    let res = await collection.deleteOne({_id: db_id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {

}
}

async function findVotes() {

  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-votes");

      let collection = db.collection('votes');

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

module.exports.getVote = getVote;
module.exports.getVoteByPermlink = getVoteByPermlink;
module.exports.addVote = addVote;
module.exports.removeVote = removeVote;
module.exports.findVotes = findVotes;