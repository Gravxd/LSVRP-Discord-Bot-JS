const Discord = require('discord.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')
const noEmoji = config.noEmoji;

module.exports = {
    name: "ban",
    run: async (client, message, args) => {

        if(!message.member.hasPermission("BAN_MEMBERS")) {
            const no_perms = new RichEmbed()
            .setColor(config.color)
            .setDescription(config.noPerms)
            return message.channel.send(no_perms)
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!toBan) {
            const no_member = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| Please provide a valid member to ban!**`)
            return message.channel.send(no_member)
        }

        let reason = args.slice(1).join(" ");
        if(!reason) {
            reason = 'None Provided';
        }
        const ban_embed = new RichEmbed()
        .setColor(config.color)
        .setDescription(`${config.tick} **| ${toBan} has been banned!**`);
        const logChannel = message.guild.channels.get(config.logChannel);
        
        if(logChannel) {
            const log_embed = new RichEmbed()
            .setColor(config.color)
            .setDescription(`**New Ban!**\n\nMember:\n${toBan} (${toBan.id})\nReason:\n\`${reason}\`\nModerator:\n${message.author}`)
            logChannel.send(log_embed)
        }
        message.delete();
        const dm_embed = new RichEmbed()
        .setColor(config.color)
        .setDescription(`**You have been banned from: ${message.guild}**\n\n**Reason:**\n\`${reason}\``)
        .setFooter(message.guild.name, message.guild.iconURL);
        if(!toBan.user.bot) await toBan.send(dm_embed)
        await toBan.ban(reason)
        message.channel.send(ban_embed)
        
        
    }
}