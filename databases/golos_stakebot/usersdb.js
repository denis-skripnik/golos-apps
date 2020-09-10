const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

const client = await MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch(console.log);

async function getUser(id) {

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.findOne({id});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function getUserByRefererCode(referer_code) {


    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.findOne({referer_code});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function addUser(id, referers, lng, prev_status, status, referer_code) {


    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('users');

        let res = await collection.insertOne({id, referers, lng, prev_status, status, referer_code});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateUser(id, referers, lng, prev_status, status, referer_code) {



  if (!client) {
      return;
  }

  try {

      const db = client.db("golos_stakebot");

      let collection = db.collection('users');

      let res = await collection.updateOne({id}, {$set: {id, referers, lng, prev_status, status, referer_code}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function findAllUsers() {
  

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('users');

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

module.exports.getUser = getUser;
module.exports.getUserByRefererCode = getUserByRefererCode;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.findAllUsers = findAllUsers;