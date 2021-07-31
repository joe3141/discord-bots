const creds = require('./creds.json')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', message => {
 if (message.content === 'React to this message if you wanna play, then type \"!spin\" without the quotes to start playing!') {
 	message.react('😳');
 }
 });





client.login(creds['slave_token']);
