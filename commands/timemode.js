const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timemode')
		.setDescription('set the timing mode')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('set the timing mode')
				.setRequired(true)
				.addChoice('seconds', 'seconds')
				.addChoice('minutes', 'minutes')
				.addChoice('hours', 'hours')
				.addChoice('days', 'days')),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		const timemode = interaction.options.getString('mode');

		db.get("timemode").set(timemode);
		db.save();
		await interaction.reply(`Set to ${timemode}.`);
	},
};
