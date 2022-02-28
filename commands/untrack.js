const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untrack')
		.setDescription('Remove keyword(s) from being tracked'),
	async execute(interaction) {
		await interaction.reply('Ping!');
	},
};
