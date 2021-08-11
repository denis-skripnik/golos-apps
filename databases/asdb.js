const pool = require('./@db.js')

async function getUser(login) {
    let client = await pool.getClient()
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

async function updateUser(login, content, flags, upvotes, all_flags_weight, all_upvotes_weight, last_update) {
    let client = await pool.getClient()

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
                all_upvotes_weight,
                last_update
            }
        }, {
            upsert: true
        });
        return res;

    } catch (err) {

        console.error(err);
        return err;
    } finally {

    }
}

async function removeactivityStats() {
    let client = await pool.getClient()
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
    let client = await pool.getClient()
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