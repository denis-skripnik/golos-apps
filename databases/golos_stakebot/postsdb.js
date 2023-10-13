const pool = require('./../@db.js')

async function getPost(id) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("golos_stakebot");

		let collection = db.collection('posts');

		let res = await collection.findOne({
			id
		});

		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function updatePost(id, author, permlink, day) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('posts');
        
                let res = await collection.updateOne({id}, {$set: {id, author, permlink, day, timestamp: new Date().getTime()}}, {upsert: true});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function removePosts() {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('posts');
    
        let res = 0;
        let now_time = new Date().getTime();
        let cursor = await collection.find({}).limit(500);
        let doc = null;
        while(null != (doc = await cursor.next())) {
            let timestamp = doc.timestamp;
            if (typeof timestamp === 'undefined') timestamp = now_time;
            let time_difference = now_time - timestamp;
            if (time_difference > 604800000) {
                await collection.deleteOne({_id: doc._id});
                res++;
            }
        }
    return res;
    } catch (err) {

        console.log(err);
        return err;
    } finally {

    }
}

async function getPostsByDay(day) {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("golos_stakebot");

    let collection = db.collection('posts');

    const res = [];
    let cursor = await collection.find({day}).limit(500);
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
module.exports.getPostsByDay = getPostsByDay;