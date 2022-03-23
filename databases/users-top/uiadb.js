const pool = require('./../@db.js')

async function getTop(token, page) {

    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('golos-uia-users');
        const query = {token}
        const sorting = {};
        sorting['summ_balance'] = -1;
        let skip = page * 100 - 100;

        collection.createIndex(sorting, function (err) {
            if (err) {
            console.error(JSON.stringify(err));
            }      
        });
        
        const res = [];
        let cursor = await collection.find(query).sort(sorting).skip(skip).limit(100);
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

async function updateTop(login, token, summ_balance, main_balance, tip_balance, market_balance) {

    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('golos-uia-users');
        collection.createIndex({ login: -1 }, function (err) {
            if (err) {
            console.error(JSON.stringify(err));
            }
        });

              let res = await collection.updateOne({login, token}, {$set: {login, token, summ_balance, main_balance, tip_balance, market_balance}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

module.exports.getTop = getTop;
module.exports.updateTop = updateTop;