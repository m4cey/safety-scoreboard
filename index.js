// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const StormDB = require("stormdb");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Dynamic command handling
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Setup database
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);

db.save();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Read and reply to registered commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'no work sorry :(', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);
