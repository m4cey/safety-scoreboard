const fs = require('node:fs');
//const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('deletes the database lmfao'),
	async execute(interaction) {
		await fs.unlink('./db.stormdb', (error) => {
			if (error) {
				console.error(error)
				interaction.reply({ content: 'something\'s wrong :/', ephemeral: true });
			}
		})
		await interaction.reply('the database was yeeted');
	},
};
