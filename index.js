// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const StormDB = require('stormdb');
const moment = require('moment');

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
	const database = db.value();

	Object.keys(database).forEach(keyword => {
		const match = message.content.includes(keyword);
		//const match = interaction.message.content.match(`/${keyword}/i`);
		if (match) {
			const oldTimestamp = db.get(keyword).value();
			db.get(keyword).set(message.createdTimestamp);
			db.save();

			let timeScore = Math.abs(moment(oldTimestamp).diff(moment(message.createdTimestamp), 'minutes'));
			message.reply(`this job has worked\n~~${timeScore}~~ **0 MINUTES**\nwithout a **${keyword}** related accident!`)
		}
	})
});

// Login to Discord with your client's token
client.login(token);
