const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getVote(_id) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

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

        client.close();
    }
}

async function getVoteByPermlink(permlink) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

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

        client.close();
    }
}

async function addVote(question, answers, permlink, consider, end_date) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

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

      client.close();
  }
}

async function removeVote(db_id) {

  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => { console.log(err); });

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

    client.close();
}
}

async function findVotes() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

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

      client.close();
  }
}

module.exports.getVote = getVote;
module.exports.getVoteByPermlink = getVoteByPermlink;
module.exports.addVote = addVote;
module.exports.removeVote = removeVote;
module.exports.findVotes = findVotes;