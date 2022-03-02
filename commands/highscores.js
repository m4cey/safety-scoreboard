const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('highscores')
		.setDescription('see the safest times and who ruined them >:('),
	async execute(interaction) {
		const engine = new StormDB.localFileEngine("./db.stormdb");
		const db = new StormDB(engine);
		const data = db.get('keywords').value();
		if (!data) {
			await interaction.reply('nada');
			return;
		}

		const fieldNames = [];
		for (obj of data) {
			const fieldName = {};
			const keyword = Object.keys(obj)[0];
			if (obj['score']) {
				const userId = Object.keys(obj['score'])[0];
				const mention = await interaction.client.users.fetch(userId).catch(console.error);
				const timeScore = obj['score'][userId];
				const timeMode = db.get('timemode').value();
				const occurences = obj['count'];
				fieldName.name = `${keyword.toUpperCase()} | ${occurences || 0} oopsies`;
				fieldName.value = `ruined by ${mention} | Safest time: ${Math.round(moment.duration(timeScore).as(timeMode))} ${timeMode}`;
				fieldName.inline = true;
				fieldNames.push(fieldName);
			}
		}
		const embed = new MessageEmbed().setColor('0x00FFFF')
			.setTitle('Highscores')
			.setAuthor({ name: 'Safety First :)' })
			.setDescription('feel the shame.')
			.addFields(fieldNames)
			.setFooter({ text: '._.' });
		if (data.length === 0)
			embed.setDescription('there\'s nothing here... add smth using /track')
		await interaction.reply({ embeds: [embed]});
	},
};
