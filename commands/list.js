const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('list all keywords'),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);

		await interaction.reply(JSON.stringify(db.value()));
	},
};
