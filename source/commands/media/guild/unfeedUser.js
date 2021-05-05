const PREFIX = require('../../../../config/botconfig.json').PREFIX;

module.exports = {
    name: "unfeeduser",
    aliases: ["unfu", "unfeedu"],
    description: "Set a user when they post a there's a notification on channel",
    usage: `\`${PREFIX}unfeeduser [mention-user / user-id]\``,
    perms: ['MANAGE_CHANNELS'],
    cooldown: 10,

    execute: async function (client, message, args) {
        const user = message.client.users.cache.get(args[0]) ||message.mentions.users.first();
        if(!user) return message.reply('That user doesn\'t exists')
        if(!guild.followedPosters.includes(user.id)) return message.channel.send('This user is not feeded!')
        await client.DBGuild.findByIdAndUpdate(message.guild.id, {$pull: {followedPosters: user.id}, new: true, upsert: true})
        message.reply('This user no Longer will appear in the Channel Feed! ')
    }
}