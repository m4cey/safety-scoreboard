const StormDB = require("stormdb");

module.exports = {
	deleteKeyword(keyword) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const data = db.get('keywords').value();
		if (!data)
			return;

		const newdata = data.filter(obj => keyword !== Object.keys(obj)[0]);
		db.get('keywords').set(newdata);
		db.save();
	},

	setKeyword(keyword, value) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const data = db.get('keywords').value();
		if (!data)
			return;

		const newdata = data.map(obj => {
			if (keyword == Object.keys(obj)[0])
				obj[keyword] = value;
			return obj;
		});
		db.get('keywords').set(newdata);
		db.save();
	},

	setScore(keyword, userId, score) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const data = db.get('keywords').value();
		if (!data)
			return;

		const newdata = data.map(obj => {
			if (keyword == Object.keys(obj)[0]) {
				if (obj['score']) {
					const currentUserId = Object.keys(obj['score']);
					if (currentUserId && obj['score'][currentUserId] > score)
						return obj;
				}
				obj['score'] = {};
				obj['score'][userId] = score;
			}
			return obj;
		});
		db.get('keywords').set(newdata);
		db.save();
	},

	incrementCount(keyword) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const data = db.get('keywords').value();
		if (!data)
			return;

		const newdata = data.map(obj => {
			if (keyword == Object.keys(obj)[0]) {
				if (obj['count'])
					obj['count'] = obj['count'] + 1;
				else
					obj['count'] = 1;
				console.log(obj);
				return obj;
			}
			return obj;
		});
		db.get('keywords').set(newdata);
		db.save();
	},
};
