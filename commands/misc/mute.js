const Discord = require('discord.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')
const noEmoji = config.noEmoji;
const ms = require('ms')

module.exports = {
    name: "mute",
    run: async (client, message, args) => {

        if(message.content === config.prefix + 'mute') {
            const example = new RichEmbed()
            .setColor(config.color)
            .setDescription(`**Usage:** \`${config.prefix}mute [@user/id] [1s/m/h/d] [optionalreason]\``);
            return message.channel.send(example)
        }
        const toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!toMute) {
            const no_member = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| Please provide a valid member to mute!**`)
            return message.channel.send(no_member)
        }
        if(!message.member.hasPermission("MANAGE_ROLES")) {
            const no_perms = new RichEmbed()
            .setColor(config.color)
            .setDescription(config.noPerms);
            return message.channel.send(no_perms)
        }
        const mute_role = message.guild.roles.get(config.mutedRole);
        if(!mute_role) {
            const no_role = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| Please setup a valid muted role in the \`config.js\`!**`);
            return message.channel.send(no_role)
        }
        let time = args[1];
        if(!time) {
            const no_time = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| You need to provide a valid time for the mute!**`)
            return message.channel.send(no_time)
        }
        const invalid_time = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| Please use \`${config.prefix}mute\` to find an example of how to use this command!**`);
        if(
            !args[1].endsWith("d") &&
            !args[1].endsWith("h") &&
            !args[1].endsWith("m") &&
            !args[1].endsWith("s") 
        ) return message.channel.send(invalid_time)
        let reason = args.slice(2).join(" ")
        if(!reason) reason = 'None Provided!';
        if(toMute.roles.has(mute_role.id)) {
            const already_muted = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${noEmoji} **| ${toMute} is already muted!**`)
            return message.channel.send(already_muted)
        } else {
            message.delete();
            const muted_success = new RichEmbed()
            .setColor(config.color)
            .setDescription(`${config.tick} **| ${toMute} has been muted for: \`${time}\`!**`)
            message.channel.send(muted_success)
            toMute.addRole(mute_role.id)
            setTimeout(() => {
                toMute.removeRole(mute_role.id)
            }, ms(args[1]))
        }

        
    }
}