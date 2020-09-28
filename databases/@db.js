const me = module.exports = {}
const MongoClient = require('mongodb').MongoClient
let clients

me.url = 'mongodb://localhost:27017'
me.poolSize = 15

me.getClient = function(){
    return clients
}

me.initialize = async function(args){
    try {
        let { url, poolSize } = args
        me.url = url || me.url
        me.poolSize = poolSize || me.poolSize
        clients = await MongoClient.connect(me.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: me.PoolSize,
        }).catch(function(error){
            console.log('mongodb at connect', error)
            reconnect()
        })
        clients.on('close', reconnect)
    } catch (error) {
        console.log('mongodb in connect', error)
        reconnect()
    }
}

const reconnect = function(){
    setTimeout(me.initialize, 1000)
}