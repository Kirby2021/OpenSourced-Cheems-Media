const { PREFIX } = require('../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "unverify",
    description: "Unverify mentioned user",
    usage: `\`${PREFIX}unverify [mention-user / user-id]\``,
    examples: `\`${PREFIX}unverify @Babu\``,
    cooldown: 0,
    adminOnly: true,

    execute: async function(client, message, args) {
        let DBUser = await client.DBUser.findById(message.author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!');

        let user = client.users.cache.get(args[0]) || message.mentions.users.first();
        if (!user) return('You must Mention a user!')
        
        try{
            await client.DBUser.findByIdAndUpdate(user.id, { $set: { verified: false  } }, { new: true, upsert: true });
                message.reply(`user ${user.tag} has been unverified`) 
        }catch(err) {
            console.log(err)
        }
    }
}