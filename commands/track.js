const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('track keyword(s)')
		.addStringOption(option =>
			option.setName('keyword')
				.setDescription('The keyword to be tracked')
				.setRequired(true)),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const keyword = interaction.options.getString('keyword');

		console.log(keyword);

		db.get(keyword).set(interaction.createdTimestamp);
		db.save();
		await interaction.reply(`Tracking ${keyword}.`);
	},
};
