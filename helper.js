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
			if (keyword === Object.keys(obj)[0])
				return obj[keyword] = value;
			return obj;
		});
		db.get('keywords').set(newdata);
		db.save();
	}
};
