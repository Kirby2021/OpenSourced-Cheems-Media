const PREFIX = require('../../../../config/botconfig.json').PREFIX;

module.exports = {
    name: "feedchannel",
    aliases: ["fc", "feedc"],
    description: "Set a feed channel",
    usage: `\`${PREFIX}feedchannel [mention-channel / channel-id]\``,
    perms: ['MANAGE_CHANNELS'],
    cooldown: 10,

    execute: async function (client, message, args) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if(!channel) return message.reply('Please provide an valid channel!')
        await client.DBGuild.findByIdAndUpdate(message.guild.id,{ $set: {feedChannel: channel.id}, new: true, upsert: true})
        message.reply('The new channel is set!')
    }
}