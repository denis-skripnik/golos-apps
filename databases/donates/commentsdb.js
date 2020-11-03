const pool = require('../@db.js')

async function getComment(token, author, permlink, prefix) {

  let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('comments' + prefix);

        let query = {token, author, permlink}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {

       
    }
}

async function addComments(comments, prefix) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('comments' + prefix);

      let res = await collection.insertMany(comments);

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function updateComment(token, author, permlink, title, amount, prefix) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('comments' + prefix);

      let res = await collection.updateOne({token, author, permlink}, {$set: {token, author, permlink, title, amount}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function removeComments(_id, prefix) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('comments' + prefix);

      let res = await collection.deleteOne({_id});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {


  }
}

async function findAllComments(token, prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('comments' + prefix);
      let query = {};
      if (token !== '') {
          query = {token};
      }
      const res = [];
      let cursor = await collection.find(query).limit(500);
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

module.exports.getComment = getComment;
module.exports.updateComment = updateComment;
module.exports.removeComments = removeComments;
module.exports.findAllComments = findAllComments;