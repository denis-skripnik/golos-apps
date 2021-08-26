const helpers = require("./helpers");
const methods = require("./methods");
const udb = require("../databases/asdb");

async function commentOperation(content, op, opbody, timestamp) {
    if (content && content.created === timestamp) {
    let user = await udb.getUser(opbody.author);
    let content_count = 1;
let flags_count = 0;
let upvote_count = 0;
let all_flags_weight = 0;
let all_upvotes_weight = 0;
let timestamp_day = timestamp.split('-')[1];
if (user && user.last_update && timestamp_day === user.last_update.split('-')[1]) {
content_count += user.content;
flags_count += user.flags;
upvote_count += user.upvotes;
all_flags_weight += user.all_flags_weight;
all_upvotes_weight += user.all_upvotes_weight;
}
await udb.updateUser(opbody.author, content_count, flags_count, upvote_count, all_flags_weight, all_upvotes_weight, timestamp);
    }
}

async function voteOperation(op, opbody, timestamp) {
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
let timestamp_day = timestamp.split('-')[1];
if (user && user.last_update && timestamp_day === user.last_update.split('-')[1]) {
content_count += user.content;
flags_count += user.flags;
upvote_count += user.upvotes;
all_flags_weight += user.all_flags_weight;
all_upvotes_weight += user.all_upvotes_weight;    
}
await udb.updateUser(opbody.voter, content_count, flags_count, upvote_count, all_flags_weight, all_upvotes_weight, timestamp);
}

module.exports.commentOperation = commentOperation;
module.exports.voteOperation = voteOperation;