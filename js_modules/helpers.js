async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
    }

    async function unixTime(){
        return parseInt(new Date().getTime()/1000)
        }

		function compareGests(a, b)
		{
			if(a.gests >= b.gests)
			{
				return -1;
			}
			else{
				return 1;
			}
		}
		

		function compareReferrers(a, b)
{
	if(a.count > b.count)
	{
		return -1;
	}
else{
		return 1;
	}
}

function compareDonators(a, b)
{
	if(a.amount > b.amount)
	{
		return -1;
	}
else{
		return 1;
	}
}

function comparePosts(a, b)
{
	if(a.amount > b.amount)
	{
		return -1;
	}
else{
		return 1;
	}
}

async function isJsonString(str) {
    try {
        let json_array = JSON.parse(str);
    return {approve: true, data: json_array};
    } catch (e) {
        return {approve: false};
    }
}

async function getRandomInRange(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	async function generateRandomCode(length)
	{
			charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}
	

	async function objectSearch(object, value) {
		let results = -1;
        for (let key in object) {
if (object[key] === value) {
    results += 1;
}
}
return results;
}

async function stringToHash(string) {
	string += 'user_id_golos_stake_bot';
	                var hash = 0;
	                if (string.length == 0) return hash;
	                for (i = 0; i < string.length; i++) {
	                    char = string.charCodeAt(i);
	                    hash = ((hash << 5) - hash) + char;
	                    hash = hash & hash;
	                }
	                return hash;
	            }

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
		  let j = Math.floor(Math.random() * (i + 1));
		  [array[i], array[j]] = [array[j], array[i]];
		}
	  }

    module.exports.unixTime = unixTime;
module.exports.sleep = sleep;
module.exports.compareGests = compareGests;
module.exports.compareReferrers = compareReferrers;
module.exports.compareDonators = compareDonators;
module.exports.comparePosts = comparePosts;
module.exports.getRandomInRange = getRandomInRange;
module.exports.isJsonString = isJsonString;
module.exports.generateRandomCode = generateRandomCode;
module.exports.objectSearch = objectSearch;
module.exports.stringToHash = stringToHash;
module.exports.shuffle = shuffle;