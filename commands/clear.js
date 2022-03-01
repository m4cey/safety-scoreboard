const fs = require('node:fs');
const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteKeyword } = require('../helper.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('delete keywords')
		.addSubcommand(subcommand =>
			subcommand
				.setName('keyword')
				.setDescription('delete one keyword')
			.addStringOption(option => option.setName('keyword').setDescription('the keyword, duh!').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('all')
				.setDescription('do I need to explain? just stay away from it')),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'keyword') {
			const keyword = interaction.options.getString('keyword');
			if (keyword) {
				const engine = new StormDB.localFileEngine("./db.stormdb");
				const db = new StormDB(engine);

				deleteKeyword(keyword);
				interaction.reply(`${keyword} was deleted`);
			} else {
				interaction.reply(`${keyword} wasn't deleted, did it even exist?`);
			}

		}	else if (interaction.options.getSubcommand() === 'all') {
			const engine = new StormDB.localFileEngine("./db.stormdb");
			const db = new StormDB(engine);

			db.get('keywords').set([]);
			db.save();
			await interaction.reply('database yeeted succesfully (maybe)');
		}
	},
};
