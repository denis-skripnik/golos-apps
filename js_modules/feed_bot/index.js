const botjs = require("./bot");

botjs.allCommands();

module.exports.run = botjs.notify;
module.exports.commentOperation = botjs.commentOperation;