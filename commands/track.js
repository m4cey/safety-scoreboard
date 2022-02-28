const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('track keyword(s)'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
