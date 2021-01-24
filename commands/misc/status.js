const Discord = require('discord.js')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')

module.exports = {
    name: "status",
    run: async (client, message, args) => {
    const playerFile = await fetch('http://51.81.64.239:30185/players.json')
    const newPlayerFile = await playerFile.json()
    const infoFile = await fetch("http://51.81.64.239:30185/info.json")
    const infoOutput = await infoFile.json()
    
    let maxPlayers = infoOutput.vars.sv_maxClients;

    let serverPlayers = [];
    newPlayerFile.forEach(player => {
      serverPlayers.push(`[${player.id}] ${player.name}`)
    })
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
    .setFooter(`Los Santos View Roleplay (Requested By: ${message.author.tag})`, config.serverLogo)
    message.channel.send(status_embed)
    
        
    }
}