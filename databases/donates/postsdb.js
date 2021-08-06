const pool = require('../@db.js')

async function getPost(token, author, permlink, prefix) {

  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('posts' + prefix);

        let query = {token, author, permlink}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {

    }
}

async function addPosts(posts, prefix) {

  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

      let res = await collection.insertMany(posts);

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function updatePost(token, author, permlink, title, amount, prefix) {
  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

      let res = await collection.updateOne({token, author, permlink}, {$set: {token, author, permlink, title, amount}}, { upsert: true });
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function removePosts(_id, prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

      let res = await collection.deleteOne({_id});

return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function findAllPosts(token, prefix) {
  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);
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

      console.error(err);
  return err;
    } finally {

  }
}

module.exports.getPost = getPost;
module.exports.updatePost = updatePost;
module.exports.removePosts = removePosts;
module.exports.findAllPosts = findAllPosts;