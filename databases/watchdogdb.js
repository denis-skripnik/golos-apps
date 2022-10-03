const pool = require('./@db.js')

const VERSION = 2;
class Chat {

    constructor(chat_id) {
        this.chat_id = chat_id;
        this.username = chat_id;
        this.watchall = true;
        this.witness = null;
        this.witnesses = [];
        this.version = VERSION;
    }

    fromJson(json) {
        this.chat_id = json.chat_id;
        this.username = json.username;
        this.witness = json.witness;

        //kind of migration
        if(json.witnesses) {
            this.witnesses = [...json.witnesses];
        }
        if(Object.keys(json).includes("watchall")) {
            this.watchall = json.watchall;
        } 
    }

    isWatching(witness) {
        if(this.watchall || !this.witness && !this.witnesses.length) {
            return true;
        }
        if(witness == this.witness) {
            return true;
        }

        if(this.witnesses.includes(witness)) {
            return true;
        }

        return false;
    }
}

async function loadWitness(owner) {

  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("goloswatchdog");

        let collection = db.collection('witnesses');

        let query = {owner}

        let res = await collection.findOne(query);

return res;

    } catch (err) {

        console.error(err);
    return err;
      } finally {


    }
}

async function getChat(chat_id) {

  let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("goloswatchdog");

        let collection = db.collection('chats');

        let query = {chat_id}

        let chat = await collection.findOne(query);

        if(!chat) {
          chat = new Chat(chat_id);
          await saveChat(chat);
      } else {
          const chobj = new Chat(chat_id);
          chobj.fromJson(chat)
          return chobj;
      }
    } catch (err) {

        console.error(err);
    return err;
      } finally {


    }
}

async function saveChat(chat) {
  if(!chat || !chat.chat_id) {
    throw Error("saveChat: chat.cha_id is empty!");
}
  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("goloswatchdog");

      let collection = db.collection('chats');

      let res = await collection.updateOne({chat_id: chat.chat_id}, {$set: chat}, { upsert: true });
return chat;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function saveWitness(witness) {

  let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("goloswatchdog");

      let collection = db.collection('witnesses');

      let res = await collection.updateOne({owner:witness.owner}, {$set: witness}, { upsert: true });
return res;

  } catch (err) {

      console.error(err);
  return err;
    } finally {


  }
}

async function loadChats() {

  let client = await pool.getClient()
  if (!client) {
      return;
  }

  try {

      const db = client.db("goloswatchdog");

      let collection = db.collection('chats');

      const res = [];
      let cursor = await collection.find({}).limit(500);
      let doc = null;
      while(null != (doc = await cursor.next())) {
        const chat = new Chat(doc.chat_id);
        chat.fromJson(doc);
        res.push(chat);
      }
  return res;
    } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

module.exports.saveChat = saveChat;
module.exports.getChat = getChat;
module.exports.saveWitness = saveWitness;
module.exports.loadChats = loadChats;
module.exports.loadWitness = loadWitness;