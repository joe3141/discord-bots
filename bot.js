const creds = require('./creds.json')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', console.error)


// client.on('message', message => {
//  if (message.content === 'ping') {
//  message.reply('pong');
//  }
//  });


// client.on('message', message => {
//  if (message.author.id === '568560978686509076') {
//  message.react('😳');
//  }
//  });


const prefix = "!spin"
const helpMessage = "Type \"!spin\" to call the bot, then react to the message to participate, then type \"!spin\" again to start playing," 
 					+ " and type \"!spin\" everytime you're done with the question and want to spin again."
 					+ "\nWhen you're done with the game, type \"!spin stop\". \n"
 					+ "To list all the players participating, type \"!spin list\".\n"
 					+ "To see this message again type \"!spin help\"."

let users = []
let playing = false
let waiting = false

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function spin(users) {
	shuffle(users)
	return [users[0], users[1]]
}


client.on('message', message => {
	if(waiting)
		return

	if (message.content === prefix){

		if (!playing){
			message.channel.send("React to this message if you wanna play, then type \"!spin\" without the quotes to start playing!")
				.then((m => {
					waiting = true
					message.channel.awaitMessages((m => m.content === "!spin"), {max:1, time: 300000, errors: ['time']})
						.then(_ => {
							m.reactions.cache.each(reaction => reaction.users.cache.each(user => {
								if(!users.includes(user))
									users.push(user)
							}))

							if(users.length < 3){
								users = []
								message.channel.send("Need at least 3 players to start the game")
								waiting = false
							}else{

								// start game
								current_players = spin(users)
								message.channel.send(`${current_players[0]} should ask ${current_players[1]}`)
								playing = true
								waiting = false
							}

						})
						.catch(collected => {
							message.channel.send("Timeout") 
							console.error(collected)
						})
				}))
				.catch(console.error)
		}else{
			current_players = spin(users)
			message.channel.send(`${current_players[0]} should ask ${current_players[1]}`)
		}

	}else if(message.content.startsWith(prefix)){
		args = message.content.split(" ")
		if (args.length > 2){
			message.channel.send(helpMessage)
			return
		}

		if(!playing){
			message.channel.send("No game in progress. Type \"!spin\" to start a game.")
			return
		}


		switch(args[1]){
			case "stop":
				playing = false
				users = []
				message.react('👋')
				break

			case "list":
				message.channel.send(users.join(" "))
				break

			case "add":
				if(users.includes(message.author)){
					message.channel.send(`${message.author} is already participating.`)	
				}else{
					users.push(message.author)
					message.channel.send(`Added ${message.author} to the game.`)
				}
				break

			default:
				message.channel.send(helpMessage)
		}
	}
}
)

client.login(creds['spin_token']);

// await the promise # done using a flag
// spin add another user # done
// spin list users # done
// unique users # done
// help # done
// finetune timeout limit	
// make it just spin instead of spin start # done
// make bot stop game after time

// test if it can be played on multiple channels, probably not.
// change status to playing spin the bottle when there's an active game, and idle when inactive

// at least 3 players to start the game # done