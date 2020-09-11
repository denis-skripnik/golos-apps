const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

let client = null

MongoClient.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(function(instance){
	client = instance
}).catch(console.log);

async function getUser(login) {

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('activityStats');

        let query = {
            login
        }

        let res = await collection.findOne(query);

        return res;

    } catch (err) {

        console.error(err);
        return err;
    } finally {

    }
}

async function updateUser(login, content, flags, upvotes, all_flags_weight, all_upvotes_weight) {


    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('activityStats');

        let res = await collection.updateOne({
            login
        }, {
            $set: {
                login,
                content,
                flags,
                upvotes,
                all_flags_weight,
                all_upvotes_weight
            }
        }, {
            upsert: true
        });
        console.log(JSON.stringify(res));
        return res;

    } catch (err) {

        console.error(err);
        return err;
    } finally {

    }
}

async function removeactivityStats() {

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('activityStats');

        let res = await collection.drop();

        return res;

    } catch (err) {

        console.log(err);
        return err;
    } finally {

    }
}

async function findAllActivityStats() {

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('activityStats');

        const res = [];
        let cursor = await collection.find({}).limit(500);
        let doc = null;
        while (null != (doc = await cursor.next())) {
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
module.exports.updateUser = updateUser;
module.exports.removeactivityStats = removeactivityStats;
module.exports.findAllActivityStats = findAllActivityStats;