const StormDB = require("stormdb");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('list all keywords'),
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
			const time = Object.values(obj)[0];
			let timeScore = Math.abs(moment().diff(moment(time), db.get('timemode').value()));
			console.log(timeScore);
			fieldName.name = keyword;
			fieldName.value = `Last accident: ${timeScore} ${db.get('timemode').value()}`;
			fieldName.inline = true;
			fieldNames.push(fieldName);
		}
		const embed = new MessageEmbed().setColor('0x00FFFF')
			.setTitle('Currentely watched for accidents:')
			.setAuthor({ name: 'Safety First :)' })
			.setDescription('you are being watched o_o')
			.addFields(fieldNames)
			.setFooter({ text: 'o__o' });
		if (data.length === 0)
			embed.setDescription('there\'s nothing here... add smth with /track')
		await interaction.reply({ embeds: [embed]});
	},
};
