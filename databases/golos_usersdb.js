const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const client = await MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch(console.log);

async function getTop(type, page) {


    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('golos-top');
        const query = {}
        query[type] = { $exists: true }
        const sorting = {};
        sorting[type] = -1;
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

async function updateTop(name, gp, gp_percent, delegated_gp, received_gp, effective_gp, golos, golos_percent, gbg, gbg_percent, tip_balance, reputation) {


    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('golos-top');
        collection.createIndex({ name: -1 }, function (err) {
            if (err) {
            console.error(JSON.stringify(err));
            }
        });

              let res = await collection.updateOne({name}, {$set: {name, gp, gp_percent, delegated_gp, received_gp, effective_gp, golos, golos_percent, gbg, gbg_percent, tip_balance, reputation}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

module.exports.getTop = getTop;
module.exports.updateTop = updateTop;