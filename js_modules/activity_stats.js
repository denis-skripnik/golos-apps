const helpers = require("./helpers");
const methods = require("./methods");
const udb = require("../databases/asdb");

async function commentOperation(op, opbody, timestamp) {
    let content = await methods.getContent(opbody.author, opbody.permlink);
    if (content && content.created === timestamp) {
    let user = await udb.getUser(opbody.author);
    let content_count = 1;
let flags_count = 0;
let upvote_count = 0;
let all_flags_weight = 0;
let all_upvotes_weight = 0;
if (user) {
content_count += user.content;
flags_count += user.flags;
upvote_count += user.upvotes;
all_flags_weight += user.all_flags_weight;
all_upvotes_weight += user.all_upvotes_weight;
}
await udb.updateUser(opbody.author, content_count, flags_count, upvote_count, all_flags_weight, all_upvotes_weight);
    }
}

async function voteOperation(op, opbody) {
    let user = await udb.getUser(opbody.voter);
    let content_count = 0;
let flags_count = 0;
let upvote_count = 0;
let all_flags_weight = 0;
let all_upvotes_weight = 0;    
if (opbody.weight < 0) {
        flags_count += 1;
        all_flags_weight += opbody.weight;
    } else if (opbody.weight > 0) {
upvote_count += 1;
all_upvotes_weight += opbody.weight;
}
if (user) {
content_count += user.content;
flags_count += user.flags;
upvote_count += user.upvotes;
all_flags_weight += user.all_flags_weight;
all_upvotes_weight += user.all_upvotes_weight;    
}
await udb.updateUser(opbody.voter, content_count, flags_count, upvote_count, all_flags_weight, all_upvotes_weight);
}

module.exports.commentOperation = commentOperation;
module.exports.voteOperation = voteOperation;