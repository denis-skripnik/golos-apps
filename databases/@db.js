const MongoClient = require('mongodb').MongoClient

const DEFAULT_URL = 'mongodb://localhost:27017'
const DEFAULT_POOL_SIZE = 10
const DEFAULT_AUTO_RECONNECT = true
const DEFAULT_RECONNECT_TRIES = 60
const DEFAULT_RECONNECT_INTERVAL = 500

const LETS = {}

const me = module.exports = {}

me.getClient = async function(){
    return LETS.poolClient
}

me.initialize = async function(args){

    LETS.url = args.url || DEFAULT_URL
    LETS.poolSize = args.poolSize || DEFAULT_POOL_SIZE
    LETS.autoReconnect = args.autoReconnect || DEFAULT_AUTO_RECONNECT
    LETS.reconnectTries = args.reconnectTries || DEFAULT_RECONNECT_TRIES
    LETS.reconnectInterval = args.reconnectInterval || DEFAULT_RECONNECT_INTERVAL

    let poolClient = await MongoClient.connect(LETS.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: LETS.poolSize,
        autoReconnect: LETS.autoReconnect,
        reconnectTries: LETS.reconnectTries,
        reconnectInterval: LETS.reconnectInterval
    }).catch(console.log)

    if (poolClient) {
        LETS.poolClient
    }

}

me.finalize = async function(){

    if (typeof LETS.poolClient === 'object') {
        LETS.poolClient.close()
    }

}