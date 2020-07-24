const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

async function getAccounts(id) {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => { console.log(err); });

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('accounts');

    const res = [];
    let cursor = await collection.find({id}).limit(500);
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

async function getAccountsByRefererCode(referer_code) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("golos_stakebot");
  
      let collection = db.collection('accounts');
  
      const res = [];
      let cursor = await collection.find({referer_code}).limit(500);
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

async function getAccount(login) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('accounts');

        let res = await collection.findOne({login});

return res;
    } catch (err) {

return err;
    } finally {

        client.close();
    }
}

async function updateAccount(id, referer_code, login, posting_key, to_vesting_shares) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos_stakebot");

      let collection = db.collection('accounts');

      let res = await collection.updateOne({login}, {$set: {id, referer_code, login, posting_key, to_vesting_shares}}, {upsert:true});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

      client.close();
  }
}

async function removeAccount(id, login) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("golos_stakebot");

      let collection = db.collection('accounts');

      let res = await collection.deleteOne({id, login});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

      client.close();
  }
}

async function findAllAccounts() {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => { console.log(err); });

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('accounts');

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

module.exports.getAccounts = getAccounts;
module.exports.getAccountsByRefererCode = getAccountsByRefererCode;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.removeAccount = removeAccount;
module.exports.findAllAccounts = findAllAccounts;