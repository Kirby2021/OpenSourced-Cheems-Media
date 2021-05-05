const PREFIX = require('../../../../config/botconfig.json').PREFIX;

module.exports = {
    name: "feeduser",
    aliases: ["fu", "feedu"],
    description: "Sends new post from given user and sends it to feedchannel",
    usage: `\`${PREFIX}feeduser [user-id]\``,
    perms: ['MANAGE_CHANNELS'],
    cooldown: 10,

    execute: async function (client, message, args) {
        const guild = await client.DBGuild.findById(message.guild.id)
        if(!guild.feedChanmnl) return message.reply('There\'s no channel set for this!')
        const user = message.client.users.cache.get(args[0])
        if(!user) return message.reply('That user doesn\'t exists')
        await client.DBGuild.findByIdAndUpdate(message.guild.id, {$push: {followedPosters: user.id}, new: true, upsert: true})
        message.reply('I will now giving feeds when the user posts!')
    }
}