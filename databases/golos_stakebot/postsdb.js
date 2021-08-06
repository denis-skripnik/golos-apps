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

async function updatePost(id, author, permlink) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("golos_stakebot");

        let collection = db.collection('posts');
        
                let res = await collection.updateOne({id}, {$set: {id, author, permlink}}, {upsert: true});

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
    
        let res = await collection.drop();

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