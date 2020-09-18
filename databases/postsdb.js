const pool = require('./@db.js')

async function getPost(author, permlink, prefix) {

  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos-donators");

        let collection = db.collection('posts' + prefix);

        let query = {author, permlink}

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

async function updatePost(author, permlink, title, golos_amount, gbg_amount, prefix) {
  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

      let res = await collection.updateOne({author, permlink}, {$set: {author, permlink, title, golos_amount, gbg_amount}}, { upsert: true });
console.log(JSON.stringify(res));
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {

  }
}

async function removePosts(prefix) {
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

      let res = await collection.drop();

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function findAllPosts(prefix) {
  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("golos-donators");

      let collection = db.collection('posts' + prefix);

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

module.exports.getPost = getPost;
module.exports.updatePost = updatePost;
module.exports.removePosts = removePosts;
module.exports.findAllPosts = findAllPosts;