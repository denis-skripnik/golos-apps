const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';


let client = null

MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(function(instance){
	client = instance
}).catch(console.log);

async function getVote(_id) {


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