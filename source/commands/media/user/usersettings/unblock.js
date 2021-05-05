const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "unblock",
    description: "unblock the user with given id",
    usage: `\`${PREFIX}unblock [mention-user / user-id]\``,
    examples: `\`${PREFIX}unblock 516280867346448384\``,
    cooldown: 10,

    execute: async function(client, message, args) {
        let DBUser = await client.DBUser.findById(message.author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!')

        let user = client.users.cache.get(args[0]) || message.mentions.users.first();
        if (user.id === message.author.id) return message.reply('You cannot block yourself');
        if (!user) return message.reply('You must give me a users ID!')
        
        if (!DBUser.blocked.includes(user.id)) return message.channel.send('This user is not blocked!')

        await client.DBUser.findByIdAndUpdate(message.author.id, { $pull: { blocked: user.id } }, { new: true, upsert: true });
        try {
          message.reply(`I have unblocked ${user.tag}`)
        } catch (err) {
            console.log(err);
            message.reply(`Error!\nPlease Contact an Admin about this`)
        }
    }
}