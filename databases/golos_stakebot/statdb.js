const pool = require('./../@db.js')

async function updateStat(q) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('stat');
        
                let res = await collection.updateOne({}, {$set: q}, {upsert: true});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function getStat() {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('stat');

    let res = await collection.findOne({});

    return res;
      } catch (err) {

    console.log(err);
return err;
  } finally {
}
}

module.exports.updateStat = updateStat;
module.exports.getStat = getStat;