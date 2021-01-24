const Discord = require('discord.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')
const noEmoji = config.noEmoji;

module.exports = {
    name: "kick",
    run: async (client, message, args) => {

        if(!message.member.hasPermission("KICK_MEMBERS")) {
            const no_perms = new RichEmbed()
            .setColor(config.color)
            .setDescription(config.noPerms)
            return message.channel.send(no_perms)
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!toKick) {
            const no_member = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| Please provide a valid member to kick!**`)
            return message.channel.send(no_member)
        }

        let reason = args.slice(1).join(" ");
        if(!reason) {
            reason = 'None Provided';
        }
        const kick_embed = new RichEmbed()
        .setColor(config.color)
        .setDescription(`${config.tick} **| ${toKick} has been kicked!**`);
        const logChannel = message.guild.channels.get(config.logChannel);
        
        if(logChannel) {
            const log_embed = new RichEmbed()
            .setColor(config.color)
            .setDescription(`**New Kick!**\n\nMember:\n${toKick} (${toKick.id})\nReason:\n\`${reason}\`\nModerator:\n${message.author}`)
            logChannel.send(log_embed)
        }
        message.delete();
        const dm_embed = new RichEmbed()
        .setColor(config.color)
        .setDescription(`**You have been kicked from: ${message.guild}**\n\n**Reason:**\n\`${reason}\``)
        .setFooter(message.guild.name, message.guild.iconURL);
        if(!toKick.user.bot) await toKick.send(dm_embed)
        await toKick.kick(reason)
        message.channel.send(kick_embed)
        
        
    }
}