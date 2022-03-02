// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const StormDB = require('stormdb');
const moment = require('moment');
const { setKeyword, setScore } = require('./helper.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Dynamic command handling
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);
db.default({ timemode: 'minutes', keywords: [] }).save();
moment().format();

client.once('ready', () => {
	console.log('Ready!');
});

// Read and reply to registered commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())	return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'no work, sorry :(', ephemeral: true });
	}
});

// Main functionality
client.on('messageCreate', async message => {
	const engine = new StormDB.localFileEngine("./db.stormdb");
	const db = new StormDB(engine);

	if (message.author.bot) return;
	const data = db.get('keywords').value();
	if (!data)
		return;

	for (obj of data) {
		const keyword = Object.keys(obj)[0];
		const oldTimestamp = Object.values(obj)[0];
		const regexp = new RegExp(keyword, 'gi');
		const match = regexp.test(message.content);
		if (match) {
			setKeyword(keyword, message.createdTimestamp);

			const timeScore = moment().diff(moment(oldTimestamp));
			const timeMode = db.get('timemode').value();
			setScore(keyword, message.member.user.id, timeScore);

			const embed = new MessageEmbed().setColor('0x00FFFF')
				.setTitle(`~~${Math.round(moment.duration(timeScore).as(timeMode))}~~ **0 ${timeMode.toUpperCase()}**`)
				.setAuthor({ name: 'This place has worked:'})
				.setDescription(`without a **${keyword}** related accident!`);
			message.reply({ embeds: [embed] });
		}
	}
});

// Login to Discord with your client's token
client.login(token);
