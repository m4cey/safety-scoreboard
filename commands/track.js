const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('track keyword(s)')
		.addStringOption(option =>
			option.setName('keyword')
				.setDescription('The word to be tracked')
				.setRequired(true)),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const keyword = interaction.options.getString('keyword');
		if (keyword == 'count' || keyword == 'score') {
			await interaction.reply('that\'s an illegal word sorry');
			return;
		}

		const obj = {};
		obj[keyword] = interaction.createdTimestamp;
		if (!db.get("keywords").value())
			db.get("keywords").set([]);
		db.get("keywords").push(obj);
		db.save();
		await interaction.reply(`Tracking ${keyword}.`);
	},
};
