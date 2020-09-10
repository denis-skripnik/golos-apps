const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const client = await MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch(console.log);

async function updateVa(vote_id, answer_id, login, gests) {


  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-votes");

      let collection = db.collection('votesAnswers');

      let res = await collection.updateOne({vote_id, login}, {$set: {vote_id, answer_id, login, gests}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function removeVa(db_id) {



if (!client) {
    return;
}

try {

    const db = client.db("golos-votes");

    let collection = db.collection('votesAnswers');

    let res = await collection.deleteOne({_id: db_id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {


}
}

async function findVa(vote_id) {


  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-votes");

      let collection = db.collection('votesAnswers');

      const res = [];
      let cursor = await collection.find({vote_id}).limit(500);
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

  module.exports.updateVa = updateVa;
module.exports.removeVa = removeVa;
module.exports.findVa = findVa;