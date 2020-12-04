const pool = require('./../@db.js')

async function addBid(user, amount) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('bids');

        let res = await collection.insertOne({user, amount});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function removeBids() {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('bids');
    
        let res = await collection.drop();

        return res;

    } catch (err) {

        console.log(err);
        return err;
    } finally {

    }
}

async function findAllBids() {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('bids');

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

module.exports.addBid = addBid;
module.exports.removeBids = removeBids;
module.exports.findAllBids = findAllBids;