const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('track keyword(s)')
		.addStringOption(option =>
			option.setName('keyword')
				.setDescription('The keyword to be tracked')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('keywords')
				.setDescription('Additional keywords to use as synonyms')
				.setRequired(false)),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const keyword = interaction.options.getString('keyword');
		const keywords = interaction.options.getString('keywords');

		console.log(keyword, keywords);

		db.get(keyword).set([]).push({'timestamp':interaction.createdTimestamp});
		if (keywords)
			db.get(keyword).push([{'keywords': keywords.split(',')}]);
		db.save();
		await interaction.reply(`Tracking for ${keyword} was set!`);
	},
};
