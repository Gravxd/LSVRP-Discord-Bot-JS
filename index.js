/*
--------------------------------------
------Created By Grav------
--https://github.com/Gravxd--
--------------------------------------
*/
const { Client, RichEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");

const config = require('./config.js')

const client = new Client({
  disableEveryone: true // set to false if you want the bot to be able to ping @ everyone
});

client.commands = new Collection();
client.aliases = new Collection();
["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});



const prefix = config.prefix; 

const fetch = require('node-fetch');
const { timeStamp } = require("console");
client.on("ready", () => {
  console.log(`Bot launched successfully. Logged in as: ${client.user.tag}`);

  setInterval(async() => {
    const playerFile = await fetch('http://51.81.64.239:30185/players.json')
    const newPlayerFile = await playerFile.json()
    const infoFile = await fetch("http://51.81.64.239:30185/info.json")
    const infoOutput = await infoFile.json()
    
    let maxPlayers = infoOutput.vars.sv_maxClients;

    let serverPlayers = [];
    newPlayerFile.forEach(player => {
      serverPlayers.push(`[${player.id}] ${player.name}`)
    })
    const server = client.guilds.get(config.serverID);
    const statusChannel = server.channels.get(config.statusChannelID);
    const messageID = config.messageID;
    let playerAmount;
    if(serverPlayers.length) {
      playerAmount = serverPlayers.length;
    } else {
      playerAmount = '0';
    }
    if(config.serverName) {
      serverName = config.serverName;
    } else {
      serverName = 'None Set!';
    }
    let playerList;
    if(serverPlayers.length) {
      playerList = serverPlayers.join(', ')
    } else {
      playerList = 'None Online!';
    }
    const status_embed = new RichEmbed()
    .setColor(config.color)
    .setTitle(`**__Server Status__**`)
    .addField(`**Player Amount**`, `\`${playerAmount}\` / \`${maxPlayers}\``)
    .setDescription(`**Online Players:**\n\`${playerList}\``)
    .setFooter(`Los Santos View Roleplay`, config.serverLogo);
    statusChannel.fetchMessage(messageID).then(messageToEdit => {
      messageToEdit.edit(status_embed).catch(err => {
        if(err) {
          console.log(err)
        }
      })
    })
  }, 5000);
});





client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  const invite = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
  if(invite.exec(message.content)) {
    if(message.member.hasPermission("MANAGE_MESSAGES")) return;
    message.delete();
    const blocked = new RichEmbed()
    .setColor(config.color)
    .setDescription(`**Message Blocked!**\n${message.author} attempted to post an invite!`)
    message.channel.send(blocked)
    const logChannel = message.guild.channels.get(config.logChannel);
    if(logChannel) {
      const log = new RichEmbed()
      .setColor(config.color)
      .setDescription(`${message.author} attempted to post: \`${message.content}\``);
      logChannel.send(log)
    }
  }

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(Client, message, args);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if(oldMessage.author.bot || newMessage.author.bot || !oldMessage.guild || !newMessage.guild) return;
  if(oldMessage.content === newMessage.content) return;

  const logChannel = oldMessage.guild.channels.get(config.logChannel) || newMessage.guild.channels.get(config.logChannel);

  let oldMessageDisplay;
  let newMessageDisplay;

  if(oldMessage.content.length > 1000) {
    oldMessageDisplay = oldMessage.content.substring(0, 1000);
  } else {
    oldMessageDisplay = oldMessage.content;
  }

  if(newMessage.content.length > 1000) {
    newMessageDisplay = newMessage.content.substring(0, 1000);
  } else {
    newMessageDisplay = newMessage.content;
  }
  
  const edit_embed = new RichEmbed()
  .setColor(config.color)
  .setTitle(`**__Message Edited__**`)
  .setDescription(`**Member:**\n${newMessage.author} (${newMessage.author.tag})\n\n**Channel:**\n${newMessage.channel} (#${newMessage.channel.name})\n\n**Old Message:**\n\`${oldMessageDisplay}\`\n\n**New Message:**\n\`${newMessageDisplay}\``); 


  const attachment_embed = new RichEmbed()
  .setColor(config.color)
  .setTitle(`**__Attachment__**`)
  .setDescription(`**Member:**\n${newMessage.author} (${newMessage.author.tag})\n\n**Channel:**\n${newMessage.channel} (#${newMessage.channel.name})\n\n**Link:**\n[Jump To](${newMessage.url})`);

  if(oldMessage.attachments.size === 0 && newMessage.attachments.size === 0) {
    logChannel.send(edit_embed)
  } else {
    logChannel.send(attachment_embed)
  }

})

client.on('messageDelete', messageDelete => {
  if(messageDelete.author.bot || !messageDelete.guild) return;

  const logChannel = messageDelete.guild.channels.get(config.logChannel);
  let messageDeleteDisplay;

  if(messageDelete.content.length > 1500) {
    messageDeleteDisplay = messageDelete.content.substring(0, 1500);
  } else {
    messageDeleteDisplay = messageDelete.content;
  }

  const delete_embed = new RichEmbed()
  .setColor(config.color)
  .setDescription(`**Member:**\n${messageDelete.author} (${messageDelete.author.tag})\n\n**Channel:**\n${messageDelete.channel} (#${messageDelete.channel.name})\n\n**Content:**\n\`${messageDeleteDisplay}\``)
  .setTitle(`**__Message Deleted__**`);
  if(messageDelete.attachments.size === 0) logChannel.send(delete_embed)
})




client.login(config.token)
